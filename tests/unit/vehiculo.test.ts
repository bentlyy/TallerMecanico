import { Vehiculo } from '../../src/domain/entities/vehiculo';

describe('Entidad Vehiculo', () => {
  it('debe crear un vehiculo con las propiedades correctas', () => {
    const vehiculo = new Vehiculo(1, 'Toyota', 'Corolla', 2020, 'ABC123', 50000, 10);

    expect(vehiculo.id).toBe(1);
    expect(vehiculo.marca).toBe('Toyota');
    expect(vehiculo.modelo).toBe('Corolla');
    expect(vehiculo.anio).toBe(2020);
    expect(vehiculo.patente).toBe('ABC123');
    expect(vehiculo.kilometraje).toBe(50000);
    expect(vehiculo.clienteId).toBe(10);
  });
});
