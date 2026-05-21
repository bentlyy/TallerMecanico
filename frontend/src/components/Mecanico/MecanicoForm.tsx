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
import { createMecanico, updateMecanico } from '../../api/mecanicoApi';
import api from '../../api/axios';
import { Mecanico } from '../../types';

interface IUsuario {
  id: number;
  nombre: string;
  email: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  initialData?: Mecanico | null;
}

export default function MecanicoForm({ open, onClose, onSave, initialData }: Props) {
  const [usuarioId, setUsuarioId] = useState<number | ''>('');
  const [especialidad, setEspecialidad] = useState('');
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    api
      .get('/usuarios')
      .then((res) => {
        const data = res.data.data || res.data;
        if (Array.isArray(data)) setUsuarios(data);
      })
      .catch(() => setUsuarios([]));
  }, []);

  useEffect(() => {
    if (initialData) {
      setUsuarioId(initialData.usuarioId || '');
      setEspecialidad(initialData.especialidad || '');
    } else {
      setUsuarioId('');
      setEspecialidad('');
    }
    setErrors({});
  }, [initialData, open]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!usuarioId) errs.usuarioId = 'Debe seleccionar un usuario';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      usuarioId: Number(usuarioId),
      especialidad: especialidad.trim() || undefined,
    };

    try {
      setLoading(true);
      if (initialData) {
        await updateMecanico(initialData.id, payload);
      } else {
        await createMecanico(payload);
      }
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
      <DialogTitle>{initialData ? 'Editar Mecánico' : 'Nuevo Mecánico'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            select
            label="Usuario"
            value={usuarioId}
            onChange={(e) => setUsuarioId(e.target.value === '' ? '' : Number(e.target.value))}
            fullWidth
            required
            margin="normal"
            error={!!errors.usuarioId}
            helperText={errors.usuarioId}
            autoFocus
          >
            <MenuItem value="">-- Seleccione --</MenuItem>
            {usuarios.map((u) => (
              <MenuItem key={u.id} value={u.id}>
                {u.nombre} ({u.email})
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Especialidad"
            value={especialidad}
            onChange={(e) => setEspecialidad(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={20} /> : initialData ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
