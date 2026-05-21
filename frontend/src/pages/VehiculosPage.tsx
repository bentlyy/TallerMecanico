import { useState } from 'react';
import { Box, Typography, Paper, Button, Snackbar, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VehiculoList from '../components/Vehiculo/VehiculoList';
import VehiculoForm from '../components/Vehiculo/VehiculoForm';
import { Vehiculo } from '../types';

export default function VehiculosPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVehiculo, setEditingVehiculo] = useState<Vehiculo | null>(null);
  const [refreshToggle, setRefreshToggle] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleEdit = (vehiculo: Vehiculo) => {
    setEditingVehiculo(vehiculo);
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingVehiculo(null);
    setDialogOpen(true);
  };

  const handleSave = () => {
    setSnackbar({
      open: true,
      message: editingVehiculo ? 'Vehículo actualizado con éxito' : 'Vehículo creado con éxito',
      severity: 'success',
    });
    setRefreshToggle((t) => !t);
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          Gestión de Vehículos
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
          Nuevo Vehículo
        </Button>
      </Box>

      <VehiculoList onEdit={handleEdit} refreshToggle={refreshToggle} />

      <VehiculoForm
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        initialData={editingVehiculo}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}
