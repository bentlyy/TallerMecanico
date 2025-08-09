import { useState, useEffect } from "react";
import { Box, Button, Typography, Paper } from "@mui/material";
import { Factura } from "../types";
import { getFacturas, deleteFactura } from "../api/facturaApi";
import FacturaList from "../components/Factura/FacturaList";
import FacturaForm from "../components/Factura/FacturaForm";

const FacturaPage = () => {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [selectedFactura, setSelectedFactura] = useState<Factura | null>(null);
  const [showForm, setShowForm] = useState(false);

  const loadFacturas = async () => {
    const data = await getFacturas();
    setFacturas(data);
  };

  useEffect(() => {
    loadFacturas();
  }, []);

  const handleCreateClick = () => {
    setSelectedFactura(null);
    setShowForm(true);
  };

  const handleEditClick = (factura: Factura) => {
    setSelectedFactura(factura);
    setShowForm(true);
  };

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
          <Button variant="contained" onClick={handleCreateClick} sx={{ mb: 2 }}>
            Nueva Factura
          </Button>
          <Paper>
            <FacturaList
              facturas={facturas}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          </Paper>
        </>
      )}

      {showForm && (
        <FacturaForm factura={selectedFactura} onClose={handleFormClose} />
      )}
    </Box>
  );
};

export default FacturaPage;
