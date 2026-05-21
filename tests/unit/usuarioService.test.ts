import { UsuarioService } from '../../src/application/usuarioService';
import { Usuario } from '../../src/domain/entities/usuario';
import { UsuarioRepository } from '../../src/domain/repositories/usuarioRepository';
import { RolService } from '../../src/application/rolService';
import { RolRepository } from '../../src/domain/repositories/rolRepository';

describe('UsuarioService', () => {
  let usuarioService: UsuarioService;
  let mockRepo: jest.Mocked<UsuarioRepository>;
  let mockRolService: jest.Mocked<RolService>;

  beforeEach(() => {
    mockRepo = {
      getAll: jest.fn(),
      count: jest.fn(),
      getById: jest.fn(),
      getByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      activate: jest.fn(),
      deactivate: jest.fn(),
    };

    const rolRepo = {} as jest.Mocked<RolRepository>;
    mockRolService = new RolService(rolRepo) as jest.Mocked<RolService>;
    mockRolService.getRolById = jest.fn();

    usuarioService = new UsuarioService(mockRepo, mockRolService);
  });

  describe('getAllUsuarios', () => {
    it('debe retornar usuarios paginados', async () => {
      const usuarios = [
        new Usuario(1, 'a@test.com', 'hash', 'A', true, 1, 1),
        new Usuario(2, 'b@test.com', 'hash', 'B', true, 1, 1),
      ];
      mockRepo.getAll.mockResolvedValue(usuarios);
      mockRepo.count.mockResolvedValue(10);

      const result = await usuarioService.getAllUsuarios(1, 1, 2);

      expect(result.data).toEqual(usuarios);
      expect(result.total).toBe(10);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(2);
      expect(result.totalPages).toBe(5);
      expect(mockRepo.getAll).toHaveBeenCalledWith(1, 0, 2);
    });
  });

  describe('createUsuario', () => {
    it('debe lanzar error si el rol no existe', async () => {
      mockRolService.getRolById = jest.fn().mockResolvedValue(null);

      await expect(
        usuarioService.createUsuario({
          email: 'test@test.com',
          passwordHash: 'pass123',
          nombre: 'Test',
          activo: true,
          rolId: 99,
          empresaId: 1,
        }),
      ).rejects.toThrow('El rol especificado no existe');
    });

    it('debe lanzar error si email ya existe', async () => {
      mockRolService.getRolById = jest.fn().mockResolvedValue({ id: 1, nombre: 'ADMIN', permisos: {} });
      mockRepo.getByEmail.mockResolvedValue(new Usuario(1, 'test@test.com', 'hash', 'Test', true, 1, 1));

      await expect(
        usuarioService.createUsuario({
          email: 'test@test.com',
          passwordHash: 'pass123',
          nombre: 'Test',
          activo: true,
          rolId: 1,
          empresaId: 1,
        }),
      ).rejects.toThrow('Ya existe un usuario con este email');
    });

    it('debe crear usuario exitosamente', async () => {
      mockRolService.getRolById = jest.fn().mockResolvedValue({ id: 1, nombre: 'ADMIN', permisos: {} });
      mockRepo.getByEmail.mockResolvedValue(null);
      const expected = new Usuario(1, 'test@test.com', 'hashed', 'Test', true, 1, 1);
      mockRepo.create.mockResolvedValue(expected);

      const result = await usuarioService.createUsuario({
        email: 'test@test.com',
        passwordHash: 'pass123',
        nombre: 'Test',
        activo: true,
        rolId: 1,
        empresaId: 1,
      });

      expect(result).toEqual(expected);
    });
  });
});
