import React, { useState } from 'react';
import RolList from '../components/Rol/RolList';
import RolForm from '../components/Rol/RolForm';
import { Rol } from '../types';
import { Box, Button, Typography } from '@mui/material';

const RolPage: React.FC = () => {
  const [editingRol, setEditingRol] = useState<Rol | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleCreateClick = () => {
    setEditingRol(null);
    setShowForm(true);
  };

  const handleEdit = (rol: Rol) => {
    setEditingRol(rol);
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
      <Typography variant="h3" mb={3}>Gestión de Roles</Typography>
      {!showForm && <Button variant="contained" onClick={handleCreateClick}>Crear Nuevo Rol</Button>}

      {showForm ? (
        <RolForm rol={editingRol || undefined} onSuccess={handleSuccess} onCancel={handleCancel} />
      ) : (
        <RolList onEdit={handleEdit} />
      )}
    </Box>
  );
};

export default RolPage;
