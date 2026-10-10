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
import { createMecanico, updateMecanico } from '../../api/mecanicoApi';
import { createUsuario, updateUsuario, getUsuario, deleteUsuario } from '../../api/usuarioApi';
import { getRoles } from '../../api/rolApi';
import { Mecanico } from '../../types';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  initialData?: Mecanico | null;
}

const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export default function MecanicoForm({ open, onClose, onSave, initialData }: Props) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setErrorMsg('');
    setPassword('');

    if (initialData) {
      setEspecialidad(initialData.especialidad || '');
      setNombre(initialData.usuario?.nombre || '');
      setEmail(initialData.usuario?.email || '');
      if (initialData.usuarioId && !initialData.usuario) {
        getUsuario(initialData.usuarioId)
          .then((res) => {
            setNombre(res.data.nombre || '');
            setEmail(res.data.email || '');
          })
          .catch(() => undefined);
      }
    } else {
      setNombre('');
      setEmail('');
      setEspecialidad('');
    }
  }, [initialData, open]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!nombre.trim()) errs.nombre = 'El nombre es requerido';
    if (!email.trim()) errs.email = 'El email es requerido';
    else if (!/^\S+@\S+\.\S+$/.test(email.trim())) errs.email = 'Email inválido';
    if (!initialData && !password) errs.password = 'La contraseña es requerida';
    else if (password && !PASSWORD_PATTERN.test(password)) {
      errs.password = 'Mínimo 8 caracteres, con mayúscula, minúscula y número';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    let createdUsuarioId: number | undefined;
    try {
      setLoading(true);
      setErrorMsg('');

      if (initialData) {
        await updateUsuario(initialData.usuarioId, {
          nombre: nombre.trim(),
          email: email.trim(),
          ...(password ? { password } : {}),
        });
        await updateMecanico(initialData.id, { especialidad: especialidad.trim() || undefined });
      } else {
        const rolesRes = await getRoles();
        const rolMecanico = (rolesRes.data || []).find((r) => r.nombre === 'MECANICO');
        if (!rolMecanico) throw new Error('No se encontró el rol MECANICO');

        const usuarioRes = await createUsuario({
          nombre: nombre.trim(),
          email: email.trim(),
          password,
          rolId: rolMecanico.id,
        });
        createdUsuarioId = usuarioRes.data.id;

        await createMecanico({
          usuarioId: usuarioRes.data.id,
          especialidad: especialidad.trim() || undefined,
        });
      }

      onSave();
      onClose();
    } catch (err) {
      if (createdUsuarioId) {
        try {
          await deleteUsuario(createdUsuarioId);
        } catch {
          // ignore cleanup failure
        }
      }
      const e = err as { response?: { data?: { error?: string } }; message?: string };
      setErrorMsg(e?.response?.data?.error || e?.message || 'Error al guardar el mecánico');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? 'Editar Mecánico' : 'Nuevo Mecánico'}</DialogTitle>
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
          <TextField
            label={initialData ? 'Nueva contraseña (opcional)' : 'Contraseña'}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required={!initialData}
            margin="normal"
            error={!!errors.password}
            helperText={errors.password || 'Mínimo 8 caracteres, con mayúscula, minúscula y número'}
          />
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
