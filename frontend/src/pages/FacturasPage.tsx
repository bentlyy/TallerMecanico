import { useState } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import FacturaList from '../components/Factura/FacturaList';
import FacturaForm from '../components/Factura/FacturaForm';

export default function FacturasPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [refreshToggle, setRefreshToggle] = useState(false);

  const handleSave = () => {
    setFormOpen(false);
    setRefreshToggle((prev) => !prev);
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ color: '#0d47a1', fontWeight: 600 }}>
          Gestión de Facturas
        </Typography>
        <Button variant="contained" onClick={() => setFormOpen(true)} sx={{ backgroundColor: '#0d47a1' }}>
          Nueva Factura
        </Button>
      </Box>
      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <FacturaList refreshToggle={refreshToggle} />
      </Paper>
      <FacturaForm open={formOpen} onClose={() => setFormOpen(false)} onSave={handleSave} />
    </Box>
  );
}
