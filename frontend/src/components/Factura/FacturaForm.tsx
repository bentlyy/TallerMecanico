import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress,
  MenuItem,
} from '@mui/material';
import { createFactura } from '../../api/facturaApi';
import { calcularTotal } from '../../api/detalleReparacionApi';
import api from '../../api/axios';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}

interface ICliente {
  id: number;
  nombre: string;
}
interface IReparacion {
  id: number;
  descripcion: string;
  costoManoObra: number;
}

export default function FacturaForm({ open, onClose, onSave }: Props) {
  const [clienteId, setClienteId] = useState<number | ''>('');
  const [reparacionId, setReparacionId] = useState<number | ''>('');
  const [costoManoObra, setCostoManoObra] = useState(0);
  const [totalRepuestos, setTotalRepuestos] = useState(0);
  const [clientes, setClientes] = useState<ICliente[]>([]);
  const [reparaciones, setReparaciones] = useState<IReparacion[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const total = costoManoObra + totalRepuestos;

  useEffect(() => {
    Promise.all([api.get('/clientes'), api.get('/reparaciones')])
      .then(([cRes, rRes]) => {
        const cData = cRes.data.data || cRes.data;
        const rData = rRes.data.data || rRes.data;
        if (Array.isArray(cData)) setClientes(cData);
        if (Array.isArray(rData)) setReparaciones(rData);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!open) {
      setClienteId('');
      setReparacionId('');
      setCostoManoObra(0);
      setTotalRepuestos(0);
      setErrors({});
    }
  }, [open]);

  const handleReparacionChange = async (value: number | '') => {
    setReparacionId(value);
    if (value === '') {
      setCostoManoObra(0);
      setTotalRepuestos(0);
      return;
    }
    try {
      const [repRes, totRes] = await Promise.all([api.get(`/reparaciones/${value}`), calcularTotal(value)]);
      const rep = repRes.data.data || repRes.data;
      setCostoManoObra(Number(rep.costoManoObra) || 0);
      setTotalRepuestos(Number(totRes.data.total) || 0);
    } catch {
      setCostoManoObra(0);
      setTotalRepuestos(0);
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!clienteId) errs.clienteId = 'Debe seleccionar un cliente';
    if (!reparacionId) errs.reparacionId = 'Debe seleccionar una reparación';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      await createFactura({
        clienteId: Number(clienteId),
        reparacionId: Number(reparacionId),
        total,
      });
      onSave();
      onClose();
    } catch {
      // handled by caller
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Nueva Factura</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            select
            label="Cliente"
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value === '' ? '' : Number(e.target.value))}
            fullWidth
            required
            margin="normal"
            error={!!errors.clienteId}
            helperText={errors.clienteId}
            autoFocus
          >
            <MenuItem value="">-- Seleccione --</MenuItem>
            {clientes.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.nombre}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Reparación"
            value={reparacionId}
            onChange={(e) => handleReparacionChange(e.target.value === '' ? '' : Number(e.target.value))}
            fullWidth
            required
            margin="normal"
            error={!!errors.reparacionId}
            helperText={errors.reparacionId}
          >
            <MenuItem value="">-- Seleccione --</MenuItem>
            {reparaciones.map((r) => (
              <MenuItem key={r.id} value={r.id}>
                #{r.id} - {r.descripcion}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Total (automático)"
            value={`$${total.toFixed(2)}`}
            fullWidth
            margin="normal"
            disabled
            helperText={`Repuestos: $${totalRepuestos.toFixed(2)} + Mano de obra: $${costoManoObra.toFixed(2)}`}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={20} /> : 'Crear'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
