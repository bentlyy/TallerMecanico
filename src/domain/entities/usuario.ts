export class Usuario {
  constructor(
    public id: number,
    public email: string,
    public passwordHash: string,
    public nombre: string,
    public activo: boolean,
    public rolId: number,
    public empresaId: number,
    public loginAttempts: number = 0,
    public lockedUntil: Date | null = null,
  ) {}
}

export type CreateUsuario = Omit<Usuario, 'id' | 'loginAttempts' | 'lockedUntil'>;
export type UpdateUsuario = Partial<Omit<Usuario, 'id' | 'passwordHash' | 'loginAttempts' | 'lockedUntil'>> & {
  password?: string;
};
