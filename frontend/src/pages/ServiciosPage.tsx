import { useState } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { Servicio } from '../types';
import ServicioList from '../components/Servicio/ServicioList';
import ServicioForm from '../components/Servicio/ServicioForm';

export default function ServiciosPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingServicio, setEditingServicio] = useState<Servicio | null>(null);
  const [refreshToggle, setRefreshToggle] = useState(false);

  const handleEdit = (servicio: Servicio) => {
    setEditingServicio(servicio);
    setFormOpen(true);
  };

  const handleCreate = () => {
    setEditingServicio(null);
    setFormOpen(true);
  };

  const handleSave = () => {
    setFormOpen(false);
    setEditingServicio(null);
    setRefreshToggle((prev) => !prev);
  };

  const handleClose = () => {
    setFormOpen(false);
    setEditingServicio(null);
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ color: '#0d47a1', fontWeight: 600 }}>
          Catálogo de Servicios
        </Typography>
        <Button variant="contained" onClick={handleCreate} sx={{ backgroundColor: '#0d47a1' }}>
          Nuevo Servicio
        </Button>
      </Box>
      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <ServicioList onEdit={handleEdit} refreshToggle={refreshToggle} />
      </Paper>
      <ServicioForm open={formOpen} onClose={handleClose} onSave={handleSave} initialData={editingServicio} />
    </Box>
  );
}
