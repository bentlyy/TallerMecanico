import { useState, useCallback } from 'react';
import { Box, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RolList from '../components/Rol/RolList';
import RolForm from '../components/Rol/RolForm';
import type { Rol } from '../types';

export default function RolesPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingRol, setEditingRol] = useState<Rol | null>(null);
  const [refreshToggle, setRefreshToggle] = useState(false);

  const triggerRefresh = useCallback(() => setRefreshToggle((p) => !p), []);

  const handleCreate = () => {
    setEditingRol(null);
    setFormOpen(true);
  };

  const handleEdit = (rol: Rol) => {
    setEditingRol(rol);
    setFormOpen(true);
  };

  const handleSave = () => {
    setFormOpen(false);
    setEditingRol(null);
    triggerRefresh();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Roles</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
          Nuevo Rol
        </Button>
      </Box>
      <RolList onEdit={handleEdit} refreshToggle={refreshToggle} />
      <RolForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingRol(null);
        }}
        onSave={handleSave}
        initialData={editingRol}
      />
    </Box>
  );
}
