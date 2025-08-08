import React, { useEffect, useState } from 'react';
import { Factura } from '../../types';
import { getFacturas } from '../../api/facturaApi';
import { Table, TableHead, TableBody, TableRow, TableCell, Paper, Typography } from '@mui/material';

const FacturaList: React.FC = () => {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFacturas()
      .then(setFacturas)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Typography>Cargando facturas...</Typography>;
  if (facturas.length === 0) return <Typography>No hay facturas disponibles</Typography>;

  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>Listado de Facturas</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Fecha</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Cliente ID</TableCell>
            <TableCell>Reparacion ID</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {facturas.map(factura => (
            <TableRow key={factura.id}>
              <TableCell>{factura.id}</TableCell>
              <TableCell>{new Date(factura.fecha).toLocaleDateString()}</TableCell>
              <TableCell>${factura.total.toFixed(2)}</TableCell>
              <TableCell>{factura.clienteId}</TableCell>
              <TableCell>{factura.reparacionId}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default FacturaList;
