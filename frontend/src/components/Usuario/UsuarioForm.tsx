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
import { createUsuario, updateUsuario } from '../../api/usuarioApi';
import { getRoles } from '../../api/rolApi';
import { Usuario, Rol } from '../../types';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  initialData?: Usuario | null;
}

export default function UsuarioForm({ open, onClose, onSave, initialData }: Props) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rolId, setRolId] = useState<number | ''>('');
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    getRoles()
      .then((res) => setRoles(res.data))
      .catch(() => setRoles([]));
  }, []);

  useEffect(() => {
    if (initialData) {
      setNombre(initialData.nombre || '');
      setEmail(initialData.email || '');
      setRolId(initialData.rolId || '');
      setPassword('');
    } else {
      setNombre('');
      setEmail('');
      setPassword('');
      setRolId('');
    }
    setErrors({});
  }, [initialData, open]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!nombre.trim()) errs.nombre = 'El nombre es requerido';
    if (!email.trim()) errs.email = 'El email es requerido';
    if (!rolId) errs.rolId = 'Debe seleccionar un rol';
    if (!initialData && !password.trim()) errs.password = 'La contraseña es requerida';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      if (initialData) {
        await updateUsuario(initialData.id, {
          nombre: nombre.trim(),
          email: email.trim(),
          rolId: Number(rolId),
        });
      } else {
        await createUsuario({
          nombre: nombre.trim(),
          email: email.trim(),
          rolId: Number(rolId),
          password,
        });
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
      <DialogTitle>{initialData ? 'Editar Usuario' : 'Nuevo Usuario'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
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
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            margin="normal"
            error={!!errors.email}
            helperText={errors.email}
          />
          {!initialData && (
            <TextField
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              margin="normal"
              error={!!errors.password}
              helperText={errors.password}
            />
          )}
          <TextField
            select
            label="Rol"
            value={rolId}
            onChange={(e) => setRolId(e.target.value === '' ? '' : Number(e.target.value))}
            fullWidth
            required
            margin="normal"
            error={!!errors.rolId}
            helperText={errors.rolId}
          >
            <MenuItem value="">-- Seleccione --</MenuItem>
            {roles.map((r) => (
              <MenuItem key={r.id} value={r.id}>
                {r.nombre}
              </MenuItem>
            ))}
          </TextField>
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
