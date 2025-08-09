import { useState, useEffect } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Factura, CreateFactura } from "../../types";
import { createFactura, updateFactura } from "../../api/facturaApi";

interface FacturaFormProps {
  factura: Factura | null;
  onClose: () => void;
}

const FacturaForm = ({ factura, onClose }: FacturaFormProps) => {
  const [formData, setFormData] = useState<CreateFactura>({
    fecha: "",
    clienteId: 0,
    total: 0,
  });

  useEffect(() => {
    if (factura) {
      setFormData({
        fecha: factura.fecha,
        clienteId: factura.clienteId,
        total: factura.total,
      });
    }
  }, [factura]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (factura) {
      await updateFactura(factura.id, formData);
    } else {
      await createFactura(formData);
    }
    onClose();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400 }}>
      <Typography variant="h6" gutterBottom>
        {factura ? "Editar Factura" : "Nueva Factura"}
      </Typography>

      <TextField
        label="Fecha"
        name="fecha"
        type="date"
        value={formData.fecha}
        onChange={handleChange}
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
        required
      />

      <TextField
        label="Cliente ID"
        name="clienteId"
        type="number"
        value={formData.clienteId}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />

      <TextField
        label="Total"
        name="total"
        type="number"
        value={formData.total}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />

      <Box mt={2}>
        <Button type="submit" variant="contained" sx={{ mr: 1 }}>
          Guardar
        </Button>
        <Button variant="outlined" onClick={onClose}>
          Cancelar
        </Button>
      </Box>
    </Box>
  );
};

export default FacturaForm;
