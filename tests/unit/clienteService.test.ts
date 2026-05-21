import { ClienteService } from '../../src/application/clienteService';
import { Cliente } from '../../src/domain/entities/cliente';
import { ClienteRepository } from '../../src/domain/repositories/clienteRepository';

describe('ClienteService', () => {
  let clienteService: ClienteService;
  let mockRepo: jest.Mocked<ClienteRepository>;

  beforeEach(() => {
    mockRepo = {
      getAll: jest.fn(),
      count: jest.fn(),
      getById: jest.fn(),
      getByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    clienteService = new ClienteService(mockRepo);
  });

  it('debe retornar clientes paginados', async () => {
    const clientes = [
      new Cliente(1, 'Juan', 'juan@test.com', '123', 'Dir 1', 1),
      new Cliente(2, 'María', 'maria@test.com', '456', 'Dir 2', 1),
    ];
    mockRepo.getAll.mockResolvedValue(clientes);
    mockRepo.count.mockResolvedValue(10);

    const result = await clienteService.getAllClientes(1, 1, 2);

    expect(result.data).toHaveLength(2);
    expect(result.total).toBe(10);
    expect(result.totalPages).toBe(5);
  });

  it('debe crear un cliente', async () => {
    const input = { nombre: 'Juan', email: 'juan@test.com', telefono: '123', direccion: 'Dir', empresaId: 1 };
    const expected = new Cliente(1, 'Juan', 'juan@test.com', '123', 'Dir', 1);
    mockRepo.create.mockResolvedValue(expected);

    const result = await clienteService.createCliente(input);
    expect(result).toEqual(expected);
  });
});
