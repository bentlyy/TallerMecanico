import { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
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
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4">Inventario</Typography>
          <Typography variant="body2" color="text.secondary">
            Piezas y repuestos del taller
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
          Nueva Pieza
        </Button>
      </Box>
      <PiezaList onEdit={handleEdit} refreshToggle={refreshToggle} />
      <PiezaForm open={formOpen} onClose={handleClose} onSave={handleSave} initialData={editingPieza} />
    </Box>
  );
}
