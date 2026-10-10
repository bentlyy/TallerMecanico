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
  Alert,
} from '@mui/material';
import { createRol, updateRol } from '../../api/rolApi';
import { getErrorMessage } from '../../api/errorMessage';
import { Rol } from '../../types';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  initialData?: Rol | null;
}

export default function RolForm({ open, onClose, onSave, initialData }: Props) {
  const [nombre, setNombre] = useState('');
  const [permisos, setPermisos] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setErrorMsg('');
    if (initialData) {
      setNombre(initialData.nombre || '');
      setPermisos(JSON.stringify(initialData.permisos, null, 2));
    } else {
      setNombre('');
      setPermisos('{}');
    }
    setErrors({});
  }, [initialData, open]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!nombre.trim()) errs.nombre = 'El nombre es requerido';
    try {
      JSON.parse(permisos);
    } catch {
      errs.permisos = 'Debe ser un JSON válido';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const permisosJson = JSON.parse(permisos);

    try {
      setLoading(true);
      setErrorMsg('');
      if (initialData) {
        await updateRol(initialData.id, { nombre: nombre.trim(), permisos: permisosJson });
      } else {
        await createRol({ nombre: nombre.trim(), permisos: permisosJson });
      }
      onSave();
      onClose();
    } catch (err) {
      setErrorMsg(getErrorMessage(err, 'Error al guardar el rol'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? 'Editar Rol' : 'Nuevo Rol'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          {errorMsg && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMsg('')}>
              {errorMsg}
            </Alert>
          )}
          <TextField
            label="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            fullWidth
            required
            margin="normal"
            error={!!errors.nombre}
            helperText={errors.nombre}
            autoFocus
          />
          <TextField
            label="Permisos (JSON)"
            value={permisos}
            onChange={(e) => setPermisos(e.target.value)}
            fullWidth
            multiline
            minRows={4}
            margin="normal"
            error={!!errors.permisos}
            helperText={errors.permisos}
            placeholder='Ej: { "clientes": { "crear": true } }'
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
