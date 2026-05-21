import { useState, useCallback } from 'react';
import { Box, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { ClienteList } from '../components/Cliente/ClienteList';
import { ClienteForm } from '../components/Cliente/ClienteForm';
import type { Cliente } from '../types';

export default function ClientesPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [refreshToggle, setRefreshToggle] = useState(false);
  const [snackbar, setSnackbar] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);

  const triggerRefresh = () => setRefreshToggle((p) => !p);

  const handleCreate = () => {
    setEditingCliente(null);
    setFormOpen(true);
  };

  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setFormOpen(true);
  };

  const handleSave = () => {
    setSnackbar({
      message: editingCliente ? 'Cliente actualizado correctamente' : 'Cliente creado correctamente',
      severity: 'success',
    });
    setFormOpen(false);
    setEditingCliente(null);
    triggerRefresh();
  };

  const handleClose = () => {
    setFormOpen(false);
    setEditingCliente(null);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Clientes</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
          Nuevo Cliente
        </Button>
      </Box>
      <ClienteList onEdit={handleEdit} refreshToggle={refreshToggle} />
      <ClienteForm open={formOpen} onClose={handleClose} onSave={handleSave} initialData={editingCliente} />
      {snackbar && (
        <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999 }}>
          <div />
        </Box>
      )}
    </Box>
  );
}
