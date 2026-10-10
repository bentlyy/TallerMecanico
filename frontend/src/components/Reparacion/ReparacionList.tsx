import { useEffect, useState, useCallback, Fragment } from 'react';
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
  Chip,
  Snackbar,
  Alert,
  Tooltip,
  TextField,
  MenuItem,
  Button,
  Collapse,
  Stack,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { getReparaciones, deleteReparacion, cambiarEstado, asignarMecanico } from '../../api/reparacionApi';
import { getMecanicos } from '../../api/mecanicoApi';
import { getClientes } from '../../api/clienteApi';
import { getErrorMessage } from '../../api/errorMessage';
import {
  exportReparacionesPdf,
  getPresetRange,
  rangeSubtitle,
  isWithinRange,
  type RangePreset,
} from '../../utils/pdfExport';
import { Reparacion, Mecanico, Cliente, EstadoReparacion } from '../../types';
import ConfirmDialog from '../common/ConfirmDialog';
import PdfExportMenu from '../common/PdfExportMenu';
import Loading from '../common/Loading';

type ChipColor = 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';

const estadoColors: Record<EstadoReparacion, ChipColor> = {
  EN_REVISION: 'warning',
  EN_REPARACION: 'info',
  TERMINADO: 'primary',
  FACTURADO: 'secondary',
  PAGADO: 'success',
  ENTREGADO: 'default',
};

const estadoLabels: Record<EstadoReparacion, string> = {
  EN_REVISION: 'En Revisión',
  EN_REPARACION: 'En Reparación',
  TERMINADO: 'Terminado',
  FACTURADO: 'Facturado',
  PAGADO: 'Pagado',
  ENTREGADO: 'Entregado',
};

interface Props {
  onEdit: (reparacion: Reparacion) => void;
  refreshToggle: boolean;
  onViewDetails: (reparacion: Reparacion) => void;
}

const ReparacionList = ({ onEdit, refreshToggle, onViewDetails }: Props) => {
  const [reparaciones, setReparaciones] = useState<Reparacion[]>([]);
  const [mecanicos, setMecanicos] = useState<Mecanico[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Reparacion | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [assignValues, setAssignValues] = useState<Record<number, number | ''>>({});
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchData = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const [rRes, mRes, cRes] = await Promise.all([getReparaciones(), getMecanicos(), getClientes()]);
      setReparaciones(rRes.data);
      setMecanicos(mRes.data);
      setClientes(cRes.data);
    } catch (err) {
      if (!silent)
        setSnackbar({ open: true, message: getErrorMessage(err, 'Error al cargar reparaciones'), severity: 'error' });
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshToggle]);

  useEffect(() => {
    const interval = setInterval(() => fetchData(true), 10000);
    const onFocus = () => fetchData(true);
    window.addEventListener('focus', onFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, [fetchData]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await deleteReparacion(deleteTarget.id);
      setSnackbar({ open: true, message: 'Reparación eliminada con éxito', severity: 'success' });
      setDeleteTarget(null);
      fetchData(true);
    } catch (err) {
      setSnackbar({ open: true, message: getErrorMessage(err, 'Error al eliminar reparación'), severity: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  const handleChangeEstado = async (id: number, nuevo: string) => {
    try {
      await cambiarEstado(id, nuevo);
      setSnackbar({
        open: true,
        message: 'Estado actualizado a ' + estadoLabels[nuevo as EstadoReparacion],
        severity: 'success',
      });
      fetchData(true);
    } catch (err) {
      setSnackbar({ open: true, message: getErrorMessage(err, 'Error al cambiar estado'), severity: 'error' });
    }
  };

  const handleAssign = async (id: number) => {
    const mech = assignValues[id];
    if (mech === '' || mech == null) return;
    try {
      await asignarMecanico(id, Number(mech));
      setAssignValues((prev) => ({ ...prev, [id]: '' }));
      setSnackbar({ open: true, message: 'Mecánico asignado con éxito', severity: 'success' });
      fetchData(true);
    } catch (err) {
      setSnackbar({ open: true, message: getErrorMessage(err, 'Error al asignar mecánico'), severity: 'error' });
    }
  };

  const handleExportPdf = async (preset: RangePreset) => {
    const range = getPresetRange(preset);
    const filtered = reparaciones.filter((r) => isWithinRange(r.fechaEntrada, range));
    const clienteMap = new Map(clientes.map((c) => [c.id, c.nombre]));
    try {
      await exportReparacionesPdf(filtered, { subtitle: rangeSubtitle(range), clienteMap });
    } catch {
      setSnackbar({ open: true, message: 'No se pudo generar el PDF', severity: 'error' });
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('es-AR');
    } catch {
      return dateStr;
    }
  };

  if (loading) return <Loading message="Cargando reparaciones..." />;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <PdfExportMenu onExport={handleExportPdf} />
      </Box>
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width={40} />
              <TableCell>ID</TableCell>
              <TableCell>Vehículo</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Mecánico</TableCell>
              <TableCell>Fecha Entrada</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reparaciones.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                    No se encontraron reparaciones
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              reparaciones.map((r) => (
                <Fragment key={r.id}>
                  <TableRow hover sx={{ transition: 'background-color 0.2s' }}>
                    <TableCell>
                      <IconButton size="small" onClick={() => setExpandedRow(expandedRow === r.id ? null : r.id)}>
                        {expandedRow === r.id ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        #{r.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {r.vehiculo
                        ? `${r.vehiculo.marca} ${r.vehiculo.modelo} (${r.vehiculo.patente})`
                        : `ID: ${r.vehiculoId}`}
                    </TableCell>
                    <TableCell sx={{ maxWidth: 280 }}>
                      <Tooltip title={r.descripcion || ''} arrow placement="top">
                        <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 280 }}>
                          {r.descripcion
                            ? r.descripcion.length > 60
                              ? `${r.descripcion.slice(0, 60)}…`
                              : r.descripcion
                            : '—'}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={estadoLabels[r.estado]}
                        color={estadoColors[r.estado]}
                        size="small"
                        variant="filled"
                      />
                    </TableCell>
                    <TableCell>{r.mecanico?.usuario?.nombre || (r.mecanicoId ? `ID: ${r.mecanicoId}` : '—')}</TableCell>
                    <TableCell>{formatDate(r.fechaEntrada)}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} justifyContent="center">
                        <Tooltip title="Ver detalles">
                          <IconButton size="small" color="info" onClick={() => onViewDetails(r)}>
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton size="small" color="primary" onClick={() => onEdit(r)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton size="small" color="error" onClick={() => setDeleteTarget(r)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={8} sx={{ py: 0 }}>
                      <Collapse in={expandedRow === r.id} timeout="auto" unmountOnExit>
                        <Box sx={{ py: 2, px: 2, bgcolor: 'grey.50' }}>
                          <Stack spacing={0.5} sx={{ mb: 2 }}>
                            <Typography variant="body2">
                              <strong>Resumen:</strong> {r.descripcion}
                            </Typography>
                            {r.problemaReportado && (
                              <Typography variant="body2">
                                <strong>Problema reportado:</strong> {r.problemaReportado}
                              </Typography>
                            )}
                            {r.diagnostico && (
                              <Typography variant="body2">
                                <strong>Diagnóstico:</strong> {r.diagnostico}
                              </Typography>
                            )}
                            {r.trabajosRealizados && (
                              <Typography variant="body2">
                                <strong>Trabajos realizados:</strong> {r.trabajosRealizados}
                              </Typography>
                            )}
                          </Stack>
                          {r.servicios && r.servicios.length > 0 && (
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                                Servicios
                              </Typography>
                              <Table size="small" sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Servicio</TableCell>
                                    <TableCell align="center">Cant.</TableCell>
                                    <TableCell align="right">P. Unit.</TableCell>
                                    <TableCell align="right">Subtotal</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {r.servicios.map((s) => (
                                    <TableRow key={s.id ?? s.servicioId}>
                                      <TableCell>{s.servicio?.nombre || `Servicio #${s.servicioId}`}</TableCell>
                                      <TableCell align="center">{s.cantidad}</TableCell>
                                      <TableCell align="right">${Number(s.precioUnitario).toFixed(2)}</TableCell>
                                      <TableCell align="right">${(s.cantidad * s.precioUnitario).toFixed(2)}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                              <Typography variant="body2" align="right" sx={{ mt: 0.5 }}>
                                <strong>Mano de obra:</strong> ${Number(r.costoManoObra).toFixed(2)}
                              </Typography>
                            </Box>
                          )}
                          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                            <TextField
                              select
                              size="small"
                              label="Estado"
                              value={r.estado}
                              onChange={(e) => handleChangeEstado(r.id, e.target.value)}
                              sx={{ width: 200 }}
                            >
                              <MenuItem value="EN_REVISION">En Revisión</MenuItem>
                              <MenuItem value="EN_REPARACION">En Reparación</MenuItem>
                              <MenuItem value="TERMINADO">Terminado</MenuItem>
                              <MenuItem value="FACTURADO" disabled>
                                Facturado (automático)
                              </MenuItem>
                              <MenuItem value="PAGADO" disabled>
                                Pagado (automático)
                              </MenuItem>
                              <MenuItem value="ENTREGADO">Entregado</MenuItem>
                            </TextField>

                            <TextField
                              select
                              size="small"
                              label="Asignar mecánico"
                              value={assignValues[r.id] ?? ''}
                              onChange={(e) => {
                                const val = e.target.value === '' ? '' : Number(e.target.value);
                                setAssignValues((prev) => ({ ...prev, [r.id]: val }));
                              }}
                              sx={{ width: 220 }}
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
                              variant="outlined"
                              onClick={() => handleAssign(r.id)}
                              startIcon={<PlayArrowIcon />}
                            >
                              Asignar
                            </Button>

                            <Button
                              size="small"
                              variant="outlined"
                              color="success"
                              onClick={() => handleChangeEstado(r.id, 'TERMINADO')}
                              startIcon={<DoneAllIcon />}
                            >
                              Marc. terminado
                            </Button>
                          </Box>
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
        title="Eliminar reparación"
        message={`Se eliminará permanentemente la reparación #${deleteTarget?.id}. Esta acción no se puede deshacer y no se permite si la reparación tiene una factura asociada o ya está terminada/entregada. ¿Desea continuar?`}
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
};

export default ReparacionList;
