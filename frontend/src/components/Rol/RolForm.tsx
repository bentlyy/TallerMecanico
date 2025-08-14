import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Alert, CircularProgress } from '@mui/material';
import { createRol, updateRol } from '../../api/rolApi';
import { Rol } from '../../types';

interface Props {
  rol?: Rol;
  onSuccess: () => void;
  onCancel: () => void;
}

const RolForm: React.FC<Props> = ({ rol, onSuccess, onCancel }) => {
  const [nombre, setNombre] = useState(rol?.nombre || '');
  const [permisos, setPermisos] = useState<string>(rol ? JSON.stringify(rol.permisos, null, 2) : '{}');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    let permisosJson;
    try {
      permisosJson = JSON.parse(permisos);
    } catch {
      setError('Permisos debe ser un JSON válido');
      return;
    }

    if (!nombre.trim()) {
      setError('El nombre es obligatorio');
      return;
    }

    setLoading(true);
    try {
      if (rol) {
        await updateRol(rol.id, { nombre, permisos: permisosJson });
      } else {
        await createRol({ nombre, permisos: permisosJson });
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Error al guardar el rol');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h5" mb={2}>
        {rol ? 'Editar Rol' : 'Crear Rol'}
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
        label="Permisos (JSON)"
        value={permisos}
        onChange={(e) => setPermisos(e.target.value)}
        fullWidth
        multiline
        minRows={4}
        disabled={loading}
        margin="normal"
        helperText="Ejemplo: { 'clientes': { 'crear': true } }"
      />

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button onClick={onCancel} disabled={loading}>Cancelar</Button>
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={20} /> : rol ? 'Actualizar' : 'Crear'}
        </Button>
      </Box>
    </Box>
  );
};

export default RolForm;
