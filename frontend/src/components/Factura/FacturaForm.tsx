import React, { useEffect, useState } from 'react';
import { Cliente, Reparacion, CreateFactura } from '../../types';
import { getClientes } from '../cliente/clienteApi'; // si tienes este api
import { getReparaciones } from '../reparacion/reparacionApi'; // idem
import { createFactura } from '../../api/facturaApi';
import { TextField, Button, MenuItem, Paper, Typography, Box } from '@mui/material';

const FacturaForm: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [reparaciones, setReparaciones] = useState<Reparacion[]>([]);
  const [clienteId, setClienteId] = useState<number | ''>('');
  const [reparacionId, setReparacionId] = useState<number | ''>('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    getClientes().then(setClientes);
    getReparaciones().then(setReparaciones);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (clienteId === '' || reparacionId === '') {
      setError('Debe seleccionar cliente y reparación');
      return;
    }

    try {
      await createFactura({ clienteId: clienteId as number, reparacionId: reparacionId as number });
      setSuccessMsg('Factura creada correctamente');
      setClienteId('');
      setReparacionId('');
    } catch (err: any) {
      setError(err.message || 'Error al crear factura');
    }
  };

  return (
    <Paper sx={{ padding: 3, maxWidth: 400 }}>
      <Typography variant="h6" gutterBottom>Crear Factura</Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          select
          fullWidth
          label="Cliente"
          value={clienteId}
          onChange={(e) => setClienteId(Number(e.target.value))}
          margin="normal"
          required
        >
          {clientes.map(c => (
            <MenuItem key={c.id} value={c.id}>{c.nombre}</MenuItem>
          ))}
        </TextField>

        <TextField
          select
          fullWidth
          label="Reparación"
          value={reparacionId}
          onChange={(e) => setReparacionId(Number(e.target.value))}
          margin="normal"
          required
        >
          {reparaciones.map(r => (
            <MenuItem key={r.id} value={r.id}>{r.descripcion}</MenuItem>
          ))}
        </TextField>

        {error && <Typography color="error">{error}</Typography>}
        {successMsg && <Typography color="primary">{successMsg}</Typography>}

        <Button type="submit" variant="contained" sx={{ mt: 2 }} fullWidth>
          Crear
        </Button>
      </Box>
    </Paper>
  );
};

export default FacturaForm;
