import { useEffect, useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  MenuItem,
  Typography,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { getDetalles, addDetalle, removeDetalle } from '../../api/detalleReparacionApi';
import { getPiezas } from '../../api/piezaApi';
import { DetalleReparacion, Pieza } from '../../types';
import Loading from '../common/Loading';

interface Props {
  open: boolean;
  onClose: () => void;
  reparacionId: number;
  costoManoObra?: number;
}

const DetalleReparacionDialog = ({ open, onClose, reparacionId, costoManoObra = 0 }: Props) => {
  const [detalles, setDetalles] = useState<DetalleReparacion[]>([]);
  const [piezas, setPiezas] = useState<Pieza[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPiezaId, setSelectedPiezaId] = useState<number | ''>('');
  const [cantidad, setCantidad] = useState<number>(1);
  const [adding, setAdding] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchDetalles = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getDetalles(reparacionId);
      setDetalles(res.data);
    } catch {
      setSnackbar({ open: true, message: 'Error al cargar detalles', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [reparacionId]);

  useEffect(() => {
    if (open) {
      fetchDetalles();
      getPiezas()
        .then((res) => setPiezas(res.data))
        .catch(() => setPiezas([]));
      setSelectedPiezaId('');
      setCantidad(1);
    }
  }, [open, fetchDetalles]);

  const handleAdd = async () => {
    if (!selectedPiezaId) return;
    const pieza = piezas.find((p) => p.id === Number(selectedPiezaId));
    if (!pieza) return;

    try {
      setAdding(true);
      await addDetalle({
        reparacionId,
        piezaId: Number(selectedPiezaId),
        cantidad,
        precioUnitario: pieza.precio,
      });
      setSnackbar({ open: true, message: 'Pieza agregada con éxito', severity: 'success' });
      setSelectedPiezaId('');
      setCantidad(1);
      fetchDetalles();
    } catch {
      setSnackbar({ open: true, message: 'Error al agregar pieza', severity: 'error' });
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (piezaId: number) => {
    try {
      await removeDetalle(reparacionId, piezaId);
      setSnackbar({ open: true, message: 'Pieza eliminada con éxito', severity: 'success' });
      fetchDetalles();
    } catch {
      setSnackbar({ open: true, message: 'Error al eliminar pieza', severity: 'error' });
    }
  };

  const totalPiezas = detalles.reduce((sum, d) => sum + d.cantidad * d.precioUnitario, 0);
  const totalGeneral = totalPiezas + Number(costoManoObra);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Detalles de Reparación #{reparacionId}</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Loading message="Cargando detalles..." />
        ) : (
          <>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end', mb: 3, flexWrap: 'wrap' }}>
              <TextField
                select
                label="Pieza"
                value={selectedPiezaId}
                onChange={(e) => setSelectedPiezaId(e.target.value === '' ? '' : Number(e.target.value))}
                sx={{ minWidth: 250 }}
                size="small"
              >
                <MenuItem value="">-- Seleccione --</MenuItem>
                {piezas.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.nombre} — ${p.precio.toFixed(2)} (stock: {p.stock})
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Cantidad"
                type="number"
                value={cantidad}
                onChange={(e) => setCantidad(Math.max(1, Number(e.target.value) || 1))}
                sx={{ width: 100 }}
                size="small"
                slotProps={{ htmlInput: { min: 1 } }}
              />
              <Button
                variant="contained"
                size="small"
                startIcon={adding ? <CircularProgress size={16} /> : <AddCircleIcon />}
                onClick={handleAdd}
                disabled={!selectedPiezaId || adding}
              >
                Agregar
              </Button>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Pieza</TableCell>
                    <TableCell align="center">Cantidad</TableCell>
                    <TableCell align="right">Precio Unit.</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                    <TableCell align="center">Acción</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {detalles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                          No hay piezas registradas
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    detalles.map((d) => (
                      <TableRow key={d.piezaId}>
                        <TableCell>{d.pieza?.nombre || `Pieza #${d.piezaId}`}</TableCell>
                        <TableCell align="center">{d.cantidad}</TableCell>
                        <TableCell align="right">${d.precioUnitario.toFixed(2)}</TableCell>
                        <TableCell align="right">
                          <Typography fontWeight={600}>${(d.cantidad * d.precioUnitario).toFixed(2)}</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <IconButton size="small" color="error" onClick={() => handleRemove(d.piezaId)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ mt: 2, textAlign: 'right' }}>
              <Typography variant="body2" color="text.secondary">
                Total piezas: <strong>${totalPiezas.toFixed(2)}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Mano de obra: <strong>${Number(costoManoObra).toFixed(2)}</strong>
              </Typography>
              <Typography variant="h6" sx={{ mt: 1 }}>
                Total general: <strong>${totalGeneral.toFixed(2)}</strong>
              </Typography>
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>

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
    </Dialog>
  );
};

export default DetalleReparacionDialog;
