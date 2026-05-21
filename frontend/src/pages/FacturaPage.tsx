import { useState, useEffect } from "react";
import { Box, Button, Typography, Paper } from "@mui/material";
import { Factura } from "../types";
import { getFacturas, deleteFactura } from "../api/facturaApi";
import FacturaList from "../components/Factura/FacturaList";
import FacturaForm from "../components/Factura/FacturaForm";

const FacturaPage = () => {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [showForm, setShowForm] = useState(false);

  const loadFacturas = async () => {
    const data = await getFacturas();
    setFacturas(data);
  };

  useEffect(() => {
    loadFacturas();
  }, []);

  const handleDeleteClick = async (id: number) => {
    await deleteFactura(id);
    loadFacturas();
  };

  const handleFormClose = () => {
    setShowForm(false);
    loadFacturas();
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Facturas
      </Typography>

      {!showForm && (
        <>
          <Button variant="contained" onClick={() => setShowForm(true)} sx={{ mb: 2 }}>
            Nueva Factura
          </Button>
          <Paper>
            <FacturaList
              facturas={facturas}
              onDelete={handleDeleteClick}
            />
          </Paper>
        </>
      )}

      {showForm && (
        <FacturaForm onClose={handleFormClose} />
      )}
    </Box>
  );
};

export default FacturaPage;
