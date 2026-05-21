import { Fragment, useState, useEffect, useCallback } from 'react';
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
  Collapse,
  Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { getFacturas, deleteFactura } from '../../api/facturaApi';
import { Factura } from '../../types';
import ConfirmDialog from '../common/ConfirmDialog';
import Loading from '../common/Loading';

interface Props {
  refreshToggle: boolean;
}

export default function FacturaList({ refreshToggle }: Props) {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Factura | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchFacturas = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getFacturas();
      setFacturas(res.data);
    } catch {
      setSnackbar({ open: true, message: 'Error al cargar facturas', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFacturas();
  }, [fetchFacturas, refreshToggle]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await deleteFactura(deleteTarget.id);
      setSnackbar({ open: true, message: 'Factura eliminada con éxito', severity: 'success' });
      setDeleteTarget(null);
      fetchFacturas();
    } catch {
      setSnackbar({ open: true, message: 'Error al eliminar factura', severity: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  if (loading) return <Loading message="Cargando facturas..." />;

  return (
    <Box>
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" />
              <TableCell>ID</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Total</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {facturas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                    No se encontraron facturas
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              facturas.map((factura) => (
                <Fragment key={factura.id}>
                  <TableRow
                    hover
                    onClick={() => setExpandedId(expandedId === factura.id ? null : factura.id)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <IconButton size="small">
                        {expandedId === factura.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </TableCell>
                    <TableCell>{factura.id}</TableCell>
                    <TableCell>{formatDate(factura.fecha)}</TableCell>
                    <TableCell>{factura.cliente?.nombre || `Cliente #${factura.clienteId}`}</TableCell>
                    <TableCell>${Number(factura.total).toFixed(2)}</TableCell>
                    <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                      <IconButton size="small" color="error" onClick={() => setDeleteTarget(factura)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={6} sx={{ py: 0, borderBottom: expandedId === factura.id ? undefined : 'none' }}>
                      <Collapse in={expandedId === factura.id} timeout="auto" unmountOnExit>
                        <Box sx={{ p: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Detalle de Reparación
                          </Typography>
                          {factura.reparacion ? (
                            <Box sx={{ pl: 2 }}>
                              <Typography variant="body2">
                                <strong>Descripción:</strong> {factura.reparacion.descripcion}
                              </Typography>
                              <Typography variant="body2" sx={{ mt: 0.5 }}>
                                <strong>Estado:</strong>{' '}
                                <Chip
                                  label={factura.reparacion.estado}
                                  size="small"
                                  color={factura.reparacion.estado === 'TERMINADO' ? 'success' : 'warning'}
                                />
                              </Typography>
                              <Typography variant="body2" sx={{ mt: 0.5 }}>
                                <strong>Costo Mano de Obra:</strong> $
                                {Number(factura.reparacion.costoManoObra).toFixed(2)}
                              </Typography>
                              <Typography variant="body2" sx={{ mt: 0.5 }}>
                                <strong>Fecha Entrada:</strong> {formatDate(factura.reparacion.fechaEntrada)}
                              </Typography>
                              {factura.reparacion.fechaSalida && (
                                <Typography variant="body2" sx={{ mt: 0.5 }}>
                                  <strong>Fecha Salida:</strong> {formatDate(factura.reparacion.fechaSalida)}
                                </Typography>
                              )}
                            </Box>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              Sin datos de reparación
                            </Typography>
                          )}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Eliminar factura"
        message={`¿Está seguro de eliminar la factura #${deleteTarget?.id}?`}
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
