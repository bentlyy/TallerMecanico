import { useState, useEffect, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Typography,
  Snackbar,
  Alert,
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getPiezas, deletePieza } from '../../api/piezaApi';
import { Pieza } from '../../types';
import ConfirmDialog from '../common/ConfirmDialog';
import Loading from '../common/Loading';

interface Props {
  onEdit: (pieza: Pieza) => void;
  refreshToggle: boolean;
}

export default function PiezaList({ onEdit, refreshToggle }: Props) {
  const [piezas, setPiezas] = useState<Pieza[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Pieza | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchPiezas = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getPiezas();
      setPiezas(res.data);
    } catch {
      setSnackbar({ open: true, message: 'Error al cargar piezas', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPiezas();
  }, [fetchPiezas, refreshToggle]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await deletePieza(deleteTarget.id);
      setSnackbar({ open: true, message: 'Pieza eliminada con éxito', severity: 'success' });
      setDeleteTarget(null);
      fetchPiezas();
    } catch {
      setSnackbar({ open: true, message: 'Error al eliminar pieza', severity: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  const getStockColor = (stock: number): 'error' | 'warning' | 'success' => {
    if (stock <= 5) return 'error';
    if (stock <= 10) return 'warning';
    return 'success';
  };

  if (loading) return <Loading message="Cargando piezas..." />;

  return (
    <Box>
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Código</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Marca</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {piezas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                    No se encontraron piezas
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              piezas.map((pieza) => (
                <TableRow key={pieza.id} hover>
                  <TableCell>{pieza.codigo}</TableCell>
                  <TableCell>{pieza.nombre}</TableCell>
                  <TableCell>{pieza.marca || '-'}</TableCell>
                  <TableCell>${Number(pieza.precio).toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip label={pieza.stock} color={getStockColor(pieza.stock)} size="small" />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" color="primary" onClick={() => onEdit(pieza)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => setDeleteTarget(pieza)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Eliminar pieza"
        message={`¿Está seguro de eliminar la pieza "${deleteTarget?.nombre}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
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
    </Box>
  );
}
