import { useState, useCallback } from 'react';
import { Box, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ReparacionList from '../components/Reparacion/ReparacionList';
import ReparacionForm from '../components/Reparacion/ReparacionForm';
import DetalleReparacionDialog from '../components/Reparacion/DetalleReparacionDialog';
import type { Reparacion } from '../types';

export default function ReparacionesPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingReparacion, setEditingReparacion] = useState<Reparacion | null>(null);
  const [refreshToggle, setRefreshToggle] = useState(false);
  const [detalleOpen, setDetalleOpen] = useState(false);
  const [detalleReparacionId, setDetalleReparacionId] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);

  const triggerRefresh = useCallback(() => setRefreshToggle((p) => !p), []);

  const handleCreate = () => {
    setEditingReparacion(null);
    setFormOpen(true);
  };

  const handleEdit = (reparacion: Reparacion) => {
    setEditingReparacion(reparacion);
    setFormOpen(true);
  };

  const handleViewDetalles = (reparacion: Reparacion) => {
    setDetalleReparacionId(reparacion.id);
    setDetalleOpen(true);
  };

  const handleSave = () => {
    setSnackbar({
      message: editingReparacion ? 'Reparación actualizada correctamente' : 'Reparación creada correctamente',
      severity: 'success',
    });
    setFormOpen(false);
    setEditingReparacion(null);
    triggerRefresh();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Reparaciones</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
          Nueva Reparación
        </Button>
      </Box>
      <ReparacionList onEdit={handleEdit} refreshToggle={refreshToggle} onViewDetails={handleViewDetalles} />
      <ReparacionForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingReparacion(null);
        }}
        onSave={handleSave}
        initialData={editingReparacion}
      />
      {detalleReparacionId && (
        <DetalleReparacionDialog
          open={detalleOpen}
          onClose={() => setDetalleOpen(false)}
          reparacionId={detalleReparacionId}
        />
      )}
    </Box>
  );
}
