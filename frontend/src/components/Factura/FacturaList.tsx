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
  Divider,
  Stack,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { getFacturas, deleteFactura, addPago, deletePago } from '../../api/facturaApi';
import { getErrorMessage } from '../../api/errorMessage';
import {
  exportFacturasPdf,
  getPresetRange,
  rangeSubtitle,
  isWithinRange,
  type RangePreset,
} from '../../utils/pdfExport';
import { Factura, MetodoPago } from '../../types';
import ConfirmDialog from '../common/ConfirmDialog';
import PdfExportMenu from '../common/PdfExportMenu';
import Loading from '../common/Loading';

interface Props {
  refreshToggle: boolean;
}

const metodoLabels: Record<MetodoPago, string> = {
  EFECTIVO: 'Efectivo',
  TRANSFERENCIA: 'Transferencia',
  TARJETA: 'Tarjeta',
  OTRO: 'Otro',
};

const sumPagos = (f: Factura) => (f.pagos ?? []).reduce((s, p) => s + Number(p.monto), 0);
const saldoFactura = (f: Factura) => Number(f.total) - sumPagos(f);
const estaPagada = (f: Factura) => saldoFactura(f) <= 0.001;

export default function FacturaList({ refreshToggle }: Props) {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Factura | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [savingPago, setSavingPago] = useState(false);
  const [pagoForm, setPagoForm] = useState<{ monto: string; metodo: MetodoPago; nota: string }>({
    monto: '',
    metodo: 'EFECTIVO',
    nota: '',
  });
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
    } catch (err) {
      setSnackbar({ open: true, message: getErrorMessage(err, 'Error al cargar facturas'), severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFacturas();
  }, [fetchFacturas, refreshToggle]);

  const replaceFactura = (updated: Factura) => {
    setFacturas((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
  };

  const handleToggle = (factura: Factura) => {
    if (expandedId === factura.id) {
      setExpandedId(null);
    } else {
      setExpandedId(factura.id);
      setPagoForm({ monto: Math.max(0, saldoFactura(factura)).toFixed(2), metodo: 'EFECTIVO', nota: '' });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await deleteFactura(deleteTarget.id);
      setSnackbar({ open: true, message: 'Factura eliminada con éxito', severity: 'success' });
      setDeleteTarget(null);
      fetchFacturas();
    } catch (err) {
      setSnackbar({ open: true, message: getErrorMessage(err, 'Error al eliminar factura'), severity: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  const handleAddPago = async (factura: Factura) => {
    const monto = Number(pagoForm.monto);
    if (!monto || monto <= 0) {
      setSnackbar({ open: true, message: 'Ingresá un monto válido', severity: 'error' });
      return;
    }
    try {
      setSavingPago(true);
      const res = await addPago(factura.id, {
        monto,
        metodo: pagoForm.metodo,
        nota: pagoForm.nota || undefined,
      });
      replaceFactura(res.data);
      setPagoForm({ monto: '', metodo: 'EFECTIVO', nota: '' });
      setSnackbar({ open: true, message: 'Pago registrado con éxito', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: getErrorMessage(err, 'Error al registrar el pago'), severity: 'error' });
    } finally {
      setSavingPago(false);
    }
  };

  const handleDeletePago = async (factura: Factura, pagoId: number) => {
    try {
      const res = await deletePago(factura.id, pagoId);
      replaceFactura(res.data);
      setSnackbar({ open: true, message: 'Pago eliminado', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: getErrorMessage(err, 'Error al eliminar el pago'), severity: 'error' });
    }
  };

  const handleExportPdf = async (preset: RangePreset) => {
    const range = getPresetRange(preset);
    const filtered = facturas.filter((f) => isWithinRange(f.fecha, range));
    try {
      await exportFacturasPdf(filtered, { subtitle: rangeSubtitle(range) });
    } catch {
      setSnackbar({ open: true, message: 'No se pudo generar el PDF', severity: 'error' });
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  if (loading) return <Loading message="Cargando facturas..." />;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <PdfExportMenu onExport={handleExportPdf} />
      </Box>
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" />
              <TableCell>ID</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Saldo</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {facturas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                    No se encontraron facturas
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              facturas.map((factura) => (
                <Fragment key={factura.id}>
                  <TableRow hover onClick={() => handleToggle(factura)} sx={{ cursor: 'pointer' }}>
                    <TableCell padding="checkbox">
                      <IconButton size="small">
                        {expandedId === factura.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </TableCell>
                    <TableCell>{factura.id}</TableCell>
                    <TableCell>{formatDate(factura.fecha)}</TableCell>
                    <TableCell>{factura.cliente?.nombre || `Cliente #${factura.clienteId}`}</TableCell>
                    <TableCell>${Number(factura.total).toFixed(2)}</TableCell>
                    <TableCell>${saldoFactura(factura).toFixed(2)}</TableCell>
                    <TableCell>
                      <Chip
                        label={estaPagada(factura) ? 'Pagada' : 'Pendiente'}
                        color={estaPagada(factura) ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                      <IconButton size="small" color="error" onClick={() => setDeleteTarget(factura)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={8} sx={{ py: 0, borderBottom: expandedId === factura.id ? undefined : 'none' }}>
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
                              {factura.reparacion.problemaReportado && (
                                <Typography variant="body2" sx={{ mt: 0.5 }}>
                                  <strong>Problema reportado:</strong> {factura.reparacion.problemaReportado}
                                </Typography>
                              )}
                              {factura.reparacion.diagnostico && (
                                <Typography variant="body2" sx={{ mt: 0.5 }}>
                                  <strong>Diagnóstico:</strong> {factura.reparacion.diagnostico}
                                </Typography>
                              )}
                              {factura.reparacion.trabajosRealizados && (
                                <Typography variant="body2" sx={{ mt: 0.5 }}>
                                  <strong>Trabajos realizados:</strong> {factura.reparacion.trabajosRealizados}
                                </Typography>
                              )}
                              <Typography variant="body2" sx={{ mt: 0.5 }}>
                                <strong>Estado:</strong>{' '}
                                <Chip
                                  label={factura.reparacion.estado}
                                  size="small"
                                  color={factura.reparacion.estado === 'ENTREGADO' ? 'default' : 'info'}
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

                          <Divider sx={{ my: 2 }} />

                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              flexWrap: 'wrap',
                              gap: 1,
                            }}
                          >
                            <Typography variant="subtitle2">Pagos</Typography>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                              <Typography variant="body2">
                                Total: <strong>${Number(factura.total).toFixed(2)}</strong>
                              </Typography>
                              <Typography variant="body2">
                                Pagado: <strong>${sumPagos(factura).toFixed(2)}</strong>
                              </Typography>
                              <Typography variant="body2">
                                Saldo: <strong>${saldoFactura(factura).toFixed(2)}</strong>
                              </Typography>
                            </Box>
                          </Box>

                          {(factura.pagos ?? []).length === 0 ? (
                            <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
                              Sin pagos registrados
                            </Typography>
                          ) : (
                            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1, my: 1 }}>
                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Fecha</TableCell>
                                    <TableCell>Método</TableCell>
                                    <TableCell align="right">Monto</TableCell>
                                    <TableCell>Nota</TableCell>
                                    <TableCell align="center">Acción</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {(factura.pagos ?? []).map((p) => (
                                    <TableRow key={p.id}>
                                      <TableCell>{formatDate(p.fecha)}</TableCell>
                                      <TableCell>{metodoLabels[p.metodo] ?? p.metodo}</TableCell>
                                      <TableCell align="right">${Number(p.monto).toFixed(2)}</TableCell>
                                      <TableCell>{p.nota || '—'}</TableCell>
                                      <TableCell align="center">
                                        <IconButton
                                          size="small"
                                          color="error"
                                          onClick={() => handleDeletePago(factura, p.id)}
                                        >
                                          <DeleteIcon fontSize="small" />
                                        </IconButton>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          )}

                          {estaPagada(factura) ? (
                            <Alert severity="success" sx={{ mt: 1 }}>
                              Factura pagada en su totalidad.
                            </Alert>
                          ) : (
                            <Stack
                              direction={{ xs: 'column', sm: 'row' }}
                              spacing={1}
                              alignItems={{ xs: 'stretch', sm: 'center' }}
                              sx={{ mt: 1 }}
                            >
                              <TextField
                                size="small"
                                type="number"
                                label="Monto"
                                value={pagoForm.monto}
                                onChange={(e) => setPagoForm((p) => ({ ...p, monto: e.target.value }))}
                                sx={{ width: 140 }}
                                slotProps={{ htmlInput: { min: 0, step: '0.01' } }}
                              />
                              <TextField
                                size="small"
                                select
                                label="Método"
                                value={pagoForm.metodo}
                                onChange={(e) => setPagoForm((p) => ({ ...p, metodo: e.target.value as MetodoPago }))}
                                sx={{ width: 170 }}
                              >
                                {(Object.keys(metodoLabels) as MetodoPago[]).map((m) => (
                                  <MenuItem key={m} value={m}>
                                    {metodoLabels[m]}
                                  </MenuItem>
                                ))}
                              </TextField>
                              <TextField
                                size="small"
                                label="Nota (opcional)"
                                value={pagoForm.nota}
                                onChange={(e) => setPagoForm((p) => ({ ...p, nota: e.target.value }))}
                                sx={{ flex: 1, minWidth: 160 }}
                              />
                              <Button
                                variant="contained"
                                size="small"
                                disabled={savingPago}
                                onClick={() => handleAddPago(factura)}
                                sx={{ height: 40 }}
                              >
                                {savingPago ? <CircularProgress size={18} color="inherit" /> : 'Registrar pago'}
                              </Button>
                            </Stack>
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
