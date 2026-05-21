import { useState } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { Pieza } from '../types';
import PiezaList from '../components/Pieza/PiezaList';
import PiezaForm from '../components/Pieza/PiezaForm';

export default function PiezasPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingPieza, setEditingPieza] = useState<Pieza | null>(null);
  const [refreshToggle, setRefreshToggle] = useState(false);

  const handleEdit = (pieza: Pieza) => {
    setEditingPieza(pieza);
    setFormOpen(true);
  };

  const handleCreate = () => {
    setEditingPieza(null);
    setFormOpen(true);
  };

  const handleSave = () => {
    setFormOpen(false);
    setEditingPieza(null);
    setRefreshToggle((prev) => !prev);
  };

  const handleClose = () => {
    setFormOpen(false);
    setEditingPieza(null);
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ color: '#0d47a1', fontWeight: 600 }}>
          Gestión de Piezas
        </Typography>
        <Button variant="contained" onClick={handleCreate} sx={{ backgroundColor: '#0d47a1' }}>
          Nueva Pieza
        </Button>
      </Box>
      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <PiezaList onEdit={handleEdit} refreshToggle={refreshToggle} />
      </Paper>
      <PiezaForm open={formOpen} onClose={handleClose} onSave={handleSave} initialData={editingPieza} />
    </Box>
  );
}
