//VehiculoForm.tsx
import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { getAllClientes } from '../../api/clienteApi';
import { Vehiculo } from '../../types';

const VehiculoForm: React.FC = () => {
  const [clientes, setClientes] = useState([]);
  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    anio: '',
    patente: '',
    kilometraje: '',
    clienteId: ''
  });

  useEffect(() => {
    getAllClientes()
      .then(res => setClientes(res.data))
      .catch(err => console.error('Error al obtener clientes', err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/vehiculos', {
        ...formData,
        anio: parseInt(formData.anio),
        kilometraje: parseInt(formData.kilometraje),
        clienteId: parseInt(formData.clienteId)
      });
      alert('Vehículo creado con éxito');
      setFormData({
        marca: '',
        modelo: '',
        anio: '',
        patente: '',
        kilometraje: '',
        clienteId: ''
      });
    } catch (err: any) {
      alert(err.response?.data?.error || 'Error al crear el vehículo');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Crear Vehículo</h2>
      <input name="marca" placeholder="Marca" value={formData.marca} onChange={handleChange} required />
      <input name="modelo" placeholder="Modelo" value={formData.modelo} onChange={handleChange} required />
      <input name="anio" type="number" placeholder="Año" value={formData.anio} onChange={handleChange} required />
      <input name="patente" placeholder="Patente" value={formData.patente} onChange={handleChange} required />
      <input name="kilometraje" type="number" placeholder="Kilometraje" value={formData.kilometraje} onChange={handleChange} required />
      <select name="clienteId" value={formData.clienteId} onChange={handleChange} required>
        <option value="">Selecciona un cliente</option>
        {clientes.map((cliente: any) => (
          <option key={cliente.id} value={cliente.id}>
            {cliente.nombre}
          </option>
        ))}
      </select>
      <button type="submit">Crear</button>
    </form>
  );
};

export default VehiculoForm;
