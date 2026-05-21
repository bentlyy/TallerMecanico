import { useState } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { Mecanico } from '../types';
import MecanicoList from '../components/Mecanico/MecanicoList';
import MecanicoForm from '../components/Mecanico/MecanicoForm';

export default function MecanicosPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingMecanico, setEditingMecanico] = useState<Mecanico | null>(null);
  const [refreshToggle, setRefreshToggle] = useState(false);

  const handleEdit = (mecanico: Mecanico) => {
    setEditingMecanico(mecanico);
    setFormOpen(true);
  };

  const handleCreate = () => {
    setEditingMecanico(null);
    setFormOpen(true);
  };

  const handleSave = () => {
    setFormOpen(false);
    setEditingMecanico(null);
    setRefreshToggle((prev) => !prev);
  };

  const handleClose = () => {
    setFormOpen(false);
    setEditingMecanico(null);
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ color: '#0d47a1', fontWeight: 600 }}>
          Gestión de Mecánicos
        </Typography>
        <Button variant="contained" onClick={handleCreate} sx={{ backgroundColor: '#0d47a1' }}>
          Nuevo Mecánico
        </Button>
      </Box>
      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <MecanicoList onEdit={handleEdit} refreshToggle={refreshToggle} />
      </Paper>
      <MecanicoForm open={formOpen} onClose={handleClose} onSave={handleSave} initialData={editingMecanico} />
    </Box>
  );
}
