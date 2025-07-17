// src/components/Vehiculo/VehiculoList.tsx
import React, { useEffect, useState } from 'react';
import { Vehiculo } from '../../types';
import api from '../../api/axios';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const VehiculoList: React.FC = () => {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVehiculos = async () => {
      try {
        const response = await api.get('/vehiculos');
        setVehiculos(response.data);
      } catch (err) {
        setError('Error al obtener los vehículos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehiculos();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/vehiculos/${id}`);
      setVehiculos(vehiculos.filter(vehiculo => vehiculo.id !== id));
    } catch (err) {
      console.error('Error al eliminar el vehículo:', err);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Marca</TableCell>
            <TableCell>Modelo</TableCell>
            <TableCell>Patente</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vehiculos.map((vehiculo) => (
            <TableRow key={vehiculo.id}>
              <TableCell>{vehiculo.id}</TableCell>
              <TableCell>{vehiculo.marca}</TableCell>
              <TableCell>{vehiculo.modelo}</TableCell>
              <TableCell>{vehiculo.patente}</TableCell>
              <TableCell>
                <Button 
                  variant="contained" 
                  color="secondary"
                  onClick={() => handleDelete(vehiculo.id)}
                >
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default VehiculoList;