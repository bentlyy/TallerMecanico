import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Box,
} from '@mui/material';
import { createCliente, updateCliente } from '../../api/clienteApi';
import { Cliente } from '../../types';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  initialData?: Cliente | null;
}

export const ClienteForm = ({ open, onClose, onSave, initialData }: Props) => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setNombre(initialData.nombre || '');
      setEmail(initialData.email || '');
      setTelefono(initialData.telefono || '');
      setDireccion(initialData.direccion || '');
    } else {
      setNombre('');
      setEmail('');
      setTelefono('');
      setDireccion('');
    }
  }, [initialData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    const payload = {
      nombre: nombre.trim(),
      email: email.trim() || undefined,
      telefono: telefono.trim() || undefined,
      direccion: direccion.trim() || undefined,
    };

    try {
      setLoading(true);
      if (initialData) {
        await updateCliente(initialData.id, payload);
      } else {
        await createCliente(payload);
      }
      onSave();
      onClose();
    } catch {
      // error handled by caller
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{initialData ? 'Editar Cliente' : 'Nuevo Cliente'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            label="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            fullWidth
            required
            margin="normal"
            autoFocus
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Dirección"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={loading || !nombre.trim()}>
            {loading ? <CircularProgress size={20} /> : initialData ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
