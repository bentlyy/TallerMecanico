import { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { createFactura } from "../../api/facturaApi";

interface FacturaFormProps {
  onClose: () => void;
}

const FacturaForm = ({ onClose }: FacturaFormProps) => {
  const [clienteId, setClienteId] = useState<number>(0);
  const [reparacionId, setReparacionId] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createFactura({ clienteId, reparacionId });
    onClose();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400 }}>
      <Typography variant="h6" gutterBottom>
        Nueva Factura
      </Typography>

      <TextField
        label="Cliente ID"
        name="clienteId"
        type="number"
        value={clienteId}
        onChange={(e) => setClienteId(Number(e.target.value))}
        fullWidth
        margin="normal"
        required
      />

      <TextField
        label="Reparacion ID"
        name="reparacionId"
        type="number"
        value={reparacionId}
        onChange={(e) => setReparacionId(Number(e.target.value))}
        fullWidth
        margin="normal"
        required
      />

      <Box mt={2}>
        <Button type="submit" variant="contained" sx={{ mr: 1 }}>
          Crear Factura
        </Button>
        <Button variant="outlined" onClick={onClose}>
          Cancelar
        </Button>
      </Box>
    </Box>
  );
};

export default FacturaForm;
