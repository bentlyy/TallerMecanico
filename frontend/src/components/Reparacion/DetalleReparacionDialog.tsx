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
  Chip,
  Stack,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { getDetalles, addDetalle, removeDetalle } from '../../api/detalleReparacionApi';
import { getServiciosReparacion, cambiarEstado, asignarMecanico, registrarSalida } from '../../api/reparacionApi';
import { getFacturaByReparacion, createFactura } from '../../api/facturaApi';
import { getPiezas } from '../../api/piezaApi';
import { getMecanicos } from '../../api/mecanicoApi';
import { getCliente } from '../../api/clienteApi';
import { getErrorMessage } from '../../api/errorMessage';
import {
  DetalleReparacion,
  Pieza,
  ReparacionServicio,
  Reparacion,
  Mecanico,
  Cliente,
  Factura,
  EstadoReparacion,
} from '../../types';
import Loading from '../common/Loading';

interface Props {
  open: boolean;
  onClose: () => void;
  reparacion: Reparacion;
  onChanged: () => void;
}

type ChipColor = 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';

const estadoLabels: Record<EstadoReparacion, string> = {
  EN_REVISION: 'En Revisión',
  EN_REPARACION: 'En Reparación',
  TERMINADO: 'Terminado',
  FACTURADO: 'Facturado',
  PAGADO: 'Pagado',
  ENTREGADO: 'Entregado',
};

const estadoColors: Record<EstadoReparacion, ChipColor> = {
  EN_REVISION: 'warning',
  EN_REPARACION: 'info',
  TERMINADO: 'primary',
  FACTURADO: 'secondary',
  PAGADO: 'success',
  ENTREGADO: 'default',
};

const estadoButtonColors: Record<EstadoReparacion, 'warning' | 'info' | 'primary' | 'success' | 'inherit'> = {
  EN_REVISION: 'warning',
  EN_REPARACION: 'info',
  TERMINADO: 'primary',
  FACTURADO: 'inherit',
  PAGADO: 'success',
  ENTREGADO: 'inherit',
};

const estados: EstadoReparacion[] = ['EN_REVISION', 'EN_REPARACION', 'TERMINADO', 'ENTREGADO'];

const DetalleReparacionDialog = ({ open, onClose, reparacion, onChanged }: Props) => {
  const reparacionId = reparacion.id;
  const [rep, setRep] = useState<Reparacion>(reparacion);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [mecanicos, setMecanicos] = useState<Mecanico[]>([]);
  const [detalles, setDetalles] = useState<DetalleReparacion[]>([]);
  const [servicios, setServicios] = useState<ReparacionServicio[]>([]);
  const [piezas, setPiezas] = useState<Pieza[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPiezaId, setSelectedPiezaId] = useState<number | ''>('');
  const [cantidad, setCantidad] = useState<number>(1);
  const [adding, setAdding] = useState(false);
  const [busy, setBusy] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [factura, setFactura] = useState<Factura | null>(null);
  const [selectedMecanico, setSelectedMecanico] = useState<number | ''>('');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const notify = (message: string, severity: 'success' | 'error' = 'success') =>
    setSnackbar({ open: true, message, severity });

  const fetchDetalles = useCallback(async () => {
    try {
      setLoading(true);
      const [dRes, sRes, pRes, mRes] = await Promise.all([
        getDetalles(reparacionId),
        getServiciosReparacion(reparacionId),
        getPiezas(),
        getMecanicos(),
      ]);
      setDetalles(dRes.data);
      setServicios(sRes.data);
      setPiezas(pRes.data);
      setMecanicos(mRes.data);
    } catch (err) {
      notify(getErrorMessage(err, 'Error al cargar los datos de la reparación'), 'error');
    } finally {
      setLoading(false);
    }

    getFacturaByReparacion(reparacionId)
      .then((res) => setFactura(res.data))
      .catch(() => setFactura(null));
  }, [reparacionId]);

  useEffect(() => {
    if (!open) return;
    setRep(reparacion);
    setSelectedPiezaId('');
    setCantidad(1);
    setSelectedMecanico(reparacion.mecanicoId ?? '');
    fetchDetalles();

    const clienteId = reparacion.vehiculo?.clienteId;
    if (clienteId) {
      getCliente(clienteId)
        .then((res) => setCliente(res.data))
        .catch(() => setCliente(null));
    } else {
      setCliente(null);
    }
  }, [open, reparacion, fetchDetalles]);

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
      notify('Pieza agregada con éxito');
      setSelectedPiezaId('');
      setCantidad(1);
      await fetchDetalles();
    } catch (err) {
      notify(getErrorMessage(err, 'Error al agregar pieza'), 'error');
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (piezaId: number) => {
    try {
      await removeDetalle(reparacionId, piezaId);
      notify('Pieza eliminada con éxito');
      await fetchDetalles();
    } catch (err) {
      notify(getErrorMessage(err, 'Error al eliminar pieza'), 'error');
    }
  };

  const handleEstado = async (estado: EstadoReparacion) => {
    if (estado === rep.estado) return;
    try {
      setBusy(true);
      const res = await cambiarEstado(reparacionId, estado);
      setRep((prev) => ({ ...prev, ...(res.data || { estado }) }));
      notify(`Estado actualizado a ${estadoLabels[estado]}`);
      onChanged();
    } catch (err) {
      notify(getErrorMessage(err, 'Error al cambiar el estado'), 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleAssign = async () => {
    if (selectedMecanico === '' || selectedMecanico == null) return;
    try {
      setBusy(true);
      await asignarMecanico(reparacionId, Number(selectedMecanico));
      const m = mecanicos.find((x) => x.id === Number(selectedMecanico)) || null;
      setRep((prev) => ({ ...prev, mecanicoId: Number(selectedMecanico), mecanico: m || prev.mecanico }));
      notify('Mecánico asignado con éxito');
      onChanged();
    } catch (err) {
      notify(getErrorMessage(err, 'Error al asignar mecánico'), 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleSalida = async () => {
    try {
      setBusy(true);
      const res = await registrarSalida(reparacionId, new Date().toISOString());
      setRep((prev) => ({ ...prev, ...(res.data || {}) }));
      notify('Salida registrada correctamente');
      onChanged();
    } catch (err) {
      notify(getErrorMessage(err, 'Error al registrar la salida'), 'error');
    } finally {
      setBusy(false);
    }
  };

  const totalPiezas = detalles.reduce((sum, d) => sum + d.cantidad * d.precioUnitario, 0);
  const totalServicios = servicios.reduce((sum, s) => sum + s.cantidad * s.precioUnitario, 0);
  const manoObraEfectiva = totalServicios > 0 ? totalServicios : Number(rep.costoManoObra || 0);
  const totalGeneral = totalPiezas + manoObraEfectiva;

  const handleGenerarFactura = async () => {
    const clienteId = rep.vehiculo?.clienteId ?? cliente?.id;
    if (!clienteId) {
      notify('No se pudo determinar el cliente de la reparación', 'error');
      return;
    }
    try {
      setGenerating(true);
      const res = await createFactura({ clienteId, reparacionId, total: totalGeneral });
      setFactura(res.data);
      setRep((prev) => ({ ...prev, estado: 'FACTURADO' }));
      notify('Factura generada correctamente');
      onChanged();
    } catch (err) {
      notify(getErrorMessage(err, 'Error al generar la factura'), 'error');
    } finally {
      setGenerating(false);
    }
  };

  const formatDate = (value?: string | null) => {
    if (!value) return '—';
    try {
      return new Date(value).toLocaleString('es-AR');
    } catch {
      return value;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
        Reparación #{reparacionId}
        <Chip label={estadoLabels[rep.estado]} color={estadoColors[rep.estado]} size="small" />
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Loading message="Cargando información..." />
        ) : (
          <>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 1,
                mb: 2,
              }}
            >
              <Typography variant="body2">
                <strong>Cliente:</strong> {cliente?.nombre || '—'}
                {cliente?.rut ? ` · ${cliente.rut}` : ''}
                {cliente?.telefono ? ` · ${cliente.telefono}` : ''}
              </Typography>
              <Typography variant="body2">
                <strong>Vehículo:</strong>{' '}
                {rep.vehiculo
                  ? `${rep.vehiculo.marca} ${rep.vehiculo.modelo} (${rep.vehiculo.patente})`
                  : `ID ${rep.vehiculoId}`}
              </Typography>
              <Typography variant="body2">
                <strong>Mecánico:</strong> {rep.mecanico?.usuario?.nombre || 'Sin asignar'}
              </Typography>
              <Typography variant="body2">
                <strong>Ingreso:</strong> {formatDate(rep.fechaEntrada)}
              </Typography>
              {rep.fechaSalida && (
                <Typography variant="body2">
                  <strong>Salida:</strong> {formatDate(rep.fechaSalida)}
                </Typography>
              )}
            </Box>

            {rep.descripcion && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Resumen:</strong> {rep.descripcion}
                </Typography>
                {rep.problemaReportado && (
                  <Typography variant="body2">
                    <strong>Problema reportado:</strong> {rep.problemaReportado}
                  </Typography>
                )}
                {rep.diagnostico && (
                  <Typography variant="body2">
                    <strong>Diagnóstico:</strong> {rep.diagnostico}
                  </Typography>
                )}
                {rep.trabajosRealizados && (
                  <Typography variant="body2">
                    <strong>Trabajos realizados:</strong> {rep.trabajosRealizados}
                  </Typography>
                )}
              </Box>
            )}

            <Divider sx={{ mb: 2 }} />

            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Estado de la reparación
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1.5 }}>
              {estados.map((estado) => (
                <Button
                  key={estado}
                  size="small"
                  variant={rep.estado === estado ? 'contained' : 'outlined'}
                  color={estadoButtonColors[estado]}
                  disabled={busy || (estado === 'ENTREGADO' && !factura)}
                  onClick={() => handleEstado(estado)}
                >
                  {estadoLabels[estado]}
                </Button>
              ))}
              <Button
                size="small"
                variant="outlined"
                startIcon={<LocalShippingIcon />}
                disabled={busy}
                onClick={handleSalida}
              >
                Registrar salida
              </Button>
            </Stack>
            {!factura && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
                Para marcar como Entregado, primero generá la factura.
              </Typography>
            )}

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="flex-start" sx={{ mb: 2 }}>
              <TextField
                select
                size="small"
                label="Asignar mecánico"
                value={selectedMecanico}
                onChange={(e) => setSelectedMecanico(e.target.value === '' ? '' : Number(e.target.value))}
                sx={{ minWidth: 220 }}
              >
                <MenuItem value="">-- Ninguno --</MenuItem>
                {mecanicos.map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.usuario?.nombre ?? `Mecánico ${m.id}`}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                size="small"
                variant="contained"
                startIcon={<AssignmentIndIcon />}
                onClick={handleAssign}
                disabled={busy || selectedMecanico === '' || selectedMecanico == null}
                sx={{ height: 40 }}
              >
                Asignar
              </Button>
            </Stack>

            <Divider sx={{ mb: 2 }} />

            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Servicios
            </Typography>
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1, mb: 3 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Servicio</TableCell>
                    <TableCell align="center">Cantidad</TableCell>
                    <TableCell align="right">Precio Unit.</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {servicios.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                          No hay servicios registrados
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    servicios.map((s) => (
                      <TableRow key={s.id ?? s.servicioId}>
                        <TableCell>{s.servicio?.nombre || `Servicio #${s.servicioId}`}</TableCell>
                        <TableCell align="center">{s.cantidad}</TableCell>
                        <TableCell align="right">${Number(s.precioUnitario).toFixed(2)}</TableCell>
                        <TableCell align="right">${(s.cantidad * s.precioUnitario).toFixed(2)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Piezas y repuestos
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end', mb: 2, flexWrap: 'wrap' }}>
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
                startIcon={adding ? <CircularProgress size={16} color="inherit" /> : <AddCircleIcon />}
                onClick={handleAdd}
                disabled={!selectedPiezaId || adding}
                sx={{ height: 40 }}
              >
                Agregar pieza
              </Button>
            </Box>

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
                        <TableCell align="right">${Number(d.precioUnitario).toFixed(2)}</TableCell>
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
                Total repuestos: <strong>${totalPiezas.toFixed(2)}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Mano de obra: <strong>${manoObraEfectiva.toFixed(2)}</strong>
              </Typography>
              <Typography variant="h6" sx={{ mt: 1 }}>
                Total general: <strong>${totalGeneral.toFixed(2)}</strong>
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Facturación
            </Typography>
            {factura ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Chip label={`Factura #${factura.id}`} size="small" />
                <Typography variant="body2">
                  Total: <strong>${Number(factura.total).toFixed(2)}</strong> · Pagado:{' '}
                  <strong>${(factura.pagos ?? []).reduce((s, p) => s + p.monto, 0).toFixed(2)}</strong> · Saldo:{' '}
                  <strong>
                    ${(factura.total - (factura.pagos ?? []).reduce((s, p) => s + p.monto, 0)).toFixed(2)}
                  </strong>
                </Typography>
                {Number(factura.total) - (factura.pagos ?? []).reduce((s, p) => s + p.monto, 0) <= 0.001 ? (
                  <Chip label="Pagada" color="success" size="small" />
                ) : (
                  <Chip label="Pendiente de pago" color="warning" size="small" />
                )}
              </Box>
            ) : (
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                <Button
                  size="small"
                  variant="contained"
                  color="secondary"
                  disabled={generating || busy}
                  onClick={handleGenerarFactura}
                >
                  {generating ? 'Generando...' : 'Generar factura'}
                </Button>
                <Typography variant="body2" color="text.secondary">
                  Se creará una factura por el total actual (${totalGeneral.toFixed(2)}) y la reparación pasará a
                  Facturado.
                </Typography>
              </Stack>
            )}
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
