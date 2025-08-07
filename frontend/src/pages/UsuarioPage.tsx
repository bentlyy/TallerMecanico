import React, { useState } from 'react';
import UsuarioList from '../components/Usuario/UsuarioList';
import UsuarioForm from '../components/Usuario/UsuarioForm';
import { Usuario } from '../types';
import { Box, Button, Typography } from '@mui/material';

const UsuarioPage: React.FC = () => {
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleCreateClick = () => {
    setEditingUsuario(null);
    setShowForm(true);
  };

  const handleEdit = (usuario: Usuario) => {
    setEditingUsuario(usuario);
    setShowForm(true);
  };

  const handleSuccess = () => {
    setShowForm(false);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h3" mb={3}>Gestión de Usuarios</Typography>
      {!showForm && <Button variant="contained" onClick={handleCreateClick}>Crear Nuevo Usuario</Button>}

      {showForm ? (
        <UsuarioForm usuario={editingUsuario || undefined} onSuccess={handleSuccess} onCancel={handleCancel} />
      ) : (
        <UsuarioList onEdit={handleEdit} />
      )}
    </Box>
  );
};

export default UsuarioPage;
