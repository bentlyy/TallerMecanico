import { useState } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { Usuario } from '../types';
import UsuarioList from '../components/Usuario/UsuarioList';
import UsuarioForm from '../components/Usuario/UsuarioForm';

export default function UsuariosPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);
  const [refreshToggle, setRefreshToggle] = useState(false);

  const handleEdit = (usuario: Usuario) => {
    setEditingUsuario(usuario);
    setFormOpen(true);
  };

  const handleCreate = () => {
    setEditingUsuario(null);
    setFormOpen(true);
  };

  const handleSave = () => {
    setFormOpen(false);
    setEditingUsuario(null);
    setRefreshToggle((prev) => !prev);
  };

  const handleClose = () => {
    setFormOpen(false);
    setEditingUsuario(null);
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ color: '#0d47a1', fontWeight: 600 }}>
          Gestión de Usuarios
        </Typography>
        <Button variant="contained" onClick={handleCreate} sx={{ backgroundColor: '#0d47a1' }}>
          Nuevo Usuario
        </Button>
      </Box>
      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <UsuarioList onEdit={handleEdit} refreshToggle={refreshToggle} />
      </Paper>
      <UsuarioForm open={formOpen} onClose={handleClose} onSave={handleSave} initialData={editingUsuario} />
    </Box>
  );
}
