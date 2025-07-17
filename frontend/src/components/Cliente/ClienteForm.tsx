import { useState } from 'react';
import { createCliente } from '../../api/clienteApi';

export const ClienteForm = () => {
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', direccion: '' });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await createCliente(form);
      alert('Cliente creado con éxito');
    } catch (error) {
      console.error(error);
      alert('Error al crear cliente');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="nombre" placeholder="Nombre" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="telefono" placeholder="Teléfono" onChange={handleChange} />
      <input name="direccion" placeholder="Dirección" onChange={handleChange} />
      <button type="submit">Crear Cliente</button>
    </form>
  );
};