import React, { useEffect, useState } from 'react';
import {
  TextField, Button, Box, Typography, Alert, CircularProgress, MenuItem
} from '@mui/material';
import { createUsuario, updateUsuario } from '../../api/usuarioApi';
import { getAllRoles } from '../../api/rolApi';
import { Usuario, Rol } from '../../types';

interface Props {
  usuario?: Usuario;
  onSuccess: () => void;
  onCancel: () => void;
}

const UsuarioForm: React.FC<Props> = ({ usuario, onSuccess, onCancel }) => {
  const [nombre, setNombre] = useState(usuario?.nombre || '');
  const [email, setEmail] = useState(usuario?.email || '');
  const [rolId, setRolId] = useState(usuario?.rolId || 0);
  const [password, setPassword] = useState('');
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await getAllRoles();
        setRoles(res.data);
      } catch (err) {
        setError('Error al cargar los roles');
      }
    };
    fetchRoles();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nombre.trim() || !email.trim() || !rolId || (!usuario && !password.trim())) {
      setError('Todos los campos son obligatorios');
      return;
    }

    setLoading(true);
    try {
      if (usuario) {
        await updateUsuario(usuario.id, { nombre, email, rolId });
      } else {
        await createUsuario({ nombre, email, rolId, password });
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Error al guardar el usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h5" mb={2}>
        {usuario ? 'Editar Usuario' : 'Crear Usuario'}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TextField
        label="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        fullWidth
        required
        disabled={loading}
        margin="normal"
      />

      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        fullWidth
        required
        disabled={loading}
        margin="normal"
      />

      {!usuario && (
        <TextField
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
          disabled={loading}
          margin="normal"
        />
      )}

      <TextField
        select
        label="Rol"
        value={rolId}
        onChange={(e) => setRolId(Number(e.target.value))}
        fullWidth
        required
        disabled={loading || roles.length === 0}
        margin="normal"
      >
        {roles.map((rol) => (
          <MenuItem key={rol.id} value={rol.id}>
            {rol.nombre}
          </MenuItem>
        ))}
      </TextField>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button onClick={onCancel} disabled={loading}>Cancelar</Button>
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={20} /> : usuario ? 'Actualizar' : 'Crear'}
        </Button>
      </Box>
    </Box>
  );
};

export default UsuarioForm;
