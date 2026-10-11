import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  Select,
  MenuItem,
  IconButton,
  TextField,
  Button,
  Collapse,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Autocomplete,
  Tooltip,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DeleteIcon from '@mui/icons-material/Delete';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonIcon from '@mui/icons-material/Person';
import PlaceIcon from '@mui/icons-material/Place';
import BuildIcon from '@mui/icons-material/Build';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { getReparaciones, patchReparacion } from '../../api/reparacionApi';
import { getMecanicos } from '../../api/mecanicoApi';
import { getUbicaciones } from '../../api/ubicacionApi';
import { getPiezas } from '../../api/piezaApi';
import { getDetalles, addDetalle, removeDetalle } from '../../api/detalleReparacionApi';
import { getErrorMessage } from '../../api/errorMessage';
import Loading from '../common/Loading';
import { useAuth } from '../../contexts/AuthContext';
import type { Reparacion, Mecanico, Ubicacion, Pieza, DetalleReparacion, EstadoReparacion } from '../../types';

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

const columnasEstados: EstadoReparacion[] = [
  'EN_REVISION',
  'EN_REPARACION',
  'TERMINADO',
  'ENTREGADO',
  'FACTURADO',
  'PAGADO',
];

interface EditableReparacion extends Reparacion {
  _editando?: boolean;
  _expandPiezas?: boolean;
  _detalles?: DetalleReparacion[];
  _saving?: boolean;
}

export default function Dashboard() {
  const { user } = useAuth();
  const isPremium = user?.plan === 'PREMIUM';
  const [reparaciones, setReparaciones] = useState<EditableReparacion[]>([]);
  const [mecanicos, setMecanicos] = useState<Mecanico[]>([]);
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
  const [piezas, setPiezas] = useState<Pieza[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [rRes, mRes, uRes, pRes] = await Promise.all([
        getReparaciones(),
        getMecanicos(),
        getUbicaciones(true),
        getPiezas(),
      ]);
      const list = (rRes.data as Reparacion[]).map((r) => ({
        ...r,
        _editando: false,
        _expandPiezas: false,
        _detalles: [],
        _saving: false,
      }));
      setReparaciones(list);
      setMecanicos(mRes.data);
      setUbicaciones(uRes.data.filter((x: Ubicacion) => x.activo));
      setPiezas(pRes.data);
      setErrorMsg('');
    } catch (err) {
      setErrorMsg(getErrorMessage(err, 'No se pudieron cargar los datos del tablero'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleEditar = async (id: number) => {
    setReparaciones((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          if (!r._editando) {
            getDetalles(id)
              .then((d) => setReparaciones((p2) => p2.map((x) => (x.id === id ? { ...x, _detalles: d.data } : x))))
              .catch(() => {});
          }
          return { ...r, _editando: !r._editando, _expandPiezas: r._editando ? false : r._expandPiezas };
        }
        return r;
      }),
    );
  };

  const handleCampo = (id: number, campo: keyof Reparacion, valor: any) => {
    setReparaciones((prev) => prev.map((r) => (r.id === id ? { ...r, [campo]: valor } : r)));
  };

  const guardarTarjeta = async (id: number) => {
    const rep = reparaciones.find((r) => r.id === id);
    if (!rep) return;
    try {
      setReparaciones((prev) => prev.map((r) => (r.id === id ? { ...r, _saving: true } : r)));
      const payload: Partial<Reparacion> = {
        estado: rep.estado,
        mecanicoId: rep.mecanicoId ?? null,
        ubicacionId: rep.ubicacionId ?? null,
        fechaEntrada: rep.fechaEntrada,
        observaciones: rep.observaciones ?? null,
      };
      const res = await patchReparacion(id, payload);
      setReparaciones((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                ...res.data,
                _editando: false,
                _expandPiezas: false,
                _saving: false,
              }
            : r,
        ),
      );
    } catch (err) {
      setErrorMsg(getErrorMessage(err, 'Error al guardar cambios'));
      setReparaciones((prev) => prev.map((r) => (r.id === id ? { ...r, _saving: false } : r)));
    }
  };

  const cancelarEdicion = (id: number) => {
    void id;
    fetchData();
  };

  const toggleExpandPiezas = (id: number) => {
    setReparaciones((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          if (!r._detalles?.length && !r._expandPiezas) {
            getDetalles(id)
              .then((d) => setReparaciones((p2) => p2.map((x) => (x.id === id ? { ...x, _detalles: d.data } : x))))
              .catch(() => {});
          }
          return { ...r, _expandPiezas: !r._expandPiezas };
        }
        return r;
      }),
    );
  };

  const handleAddDetalle = async (reparacionId: number, pieza: Pieza, cantidad: number) => {
    try {
      await addDetalle({ reparacionId, piezaId: pieza.id, cantidad, precioUnitario: pieza.precio });
      const d = await getDetalles(reparacionId);
      setReparaciones((prev) => prev.map((r) => (r.id === reparacionId ? { ...r, _detalles: d.data } : r)));
    } catch (err) {
      setErrorMsg(getErrorMessage(err, 'Error al agregar repuesto'));
    }
  };

  const handleRemoveDetalle = async (reparacionId: number, piezaId: number) => {
    try {
      await removeDetalle(reparacionId, piezaId);
      const d = await getDetalles(reparacionId);
      setReparaciones((prev) => prev.map((r) => (r.id === reparacionId ? { ...r, _detalles: d.data } : r)));
    } catch (err) {
      setErrorMsg(getErrorMessage(err, 'Error al eliminar repuesto'));
    }
  };

  const formatFecha = (v?: string | null) => {
    if (!v) return '-';
    try {
      const d = new Date(v);
      return d.toLocaleString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return v;
    }
  };

  const formatMoney = (n: number) =>
    n.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });

  const getMecanicoNombre = (m?: Mecanico | null) => m?.usuario?.nombre || '-';
  const getUbicacionNombre = (u?: Ubicacion | null) => u?.nombre || '-';
  const reparacionesPorEstado = (estado: EstadoReparacion) => reparaciones.filter((r) => r.estado === estado);

  if (loading) return <Loading message="Cargando tablero..." />;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minHeight: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Tablero de Taller
        </Typography>
        <Button size="small" variant="outlined" onClick={fetchData} disabled={loading}>
          Actualizar
        </Button>
      </Box>
      {errorMsg && (
        <Alert severity="error" onClose={() => setErrorMsg('')}>
          {errorMsg}
        </Alert>
      )}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          pb: 1,
          alignItems: 'flex-start',
          '&::-webkit-scrollbar': { height: 6 },
        }}
      >
        {columnasEstados.map((estado) => (
          <Box key={estado} sx={{ minWidth: { xs: 320, sm: 360, md: 380 }, maxWidth: 420, flexShrink: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, px: 0.5 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Chip label={estadoLabels[estado]} color={estadoColors[estado]} size="small" />
                <Typography variant="caption" color="text.secondary">
                  {reparacionesPorEstado(estado).length}
                </Typography>
              </Stack>
            </Box>
            <Stack spacing={1.5} sx={{ maxHeight: 'calc(100vh - 220px)', overflowY: 'auto', pr: 0.5 }}>
              {reparacionesPorEstado(estado).length === 0 ? (
                <Card variant="outlined" sx={{ borderStyle: 'dashed' }}>
                  <CardContent sx={{ py: 2, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      Sin vehículos
                    </Typography>
                  </CardContent>
                </Card>
              ) : (
                reparacionesPorEstado(estado).map((r) => (
                  <Card
                    key={r.id}
                    variant="outlined"
                    sx={{ borderRadius: 2, boxShadow: 'none', '&:hover': { borderColor: 'primary.main' } }}
                  >
                    <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                      <Stack spacing={1.25}>
                        <Box
                          sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}
                        >
                          <Stack spacing={0.5} sx={{ minWidth: 0, flex: 1 }}>
                            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ minWidth: 0 }}>
                              <DirectionsCarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="subtitle2" noWrap sx={{ fontWeight: 600 }}>
                                {r.vehiculo ? `${r.vehiculo.patente}` : `Vehículo #${r.id}`}
                              </Typography>
                            </Stack>
                            {r.vehiculo?.cliente && (
                              <Stack direction="row" alignItems="center" spacing={0.5}>
                                <PersonIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                                <Typography variant="caption" color="text.secondary" noWrap>
                                  {r.vehiculo.cliente.nombre}
                                </Typography>
                              </Stack>
                            )}
                          </Stack>
                          {!r._editando ? (
                            <Tooltip title="Editar">
                              <IconButton size="small" onClick={() => toggleEditar(r.id)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Stack direction="row">
                              <Tooltip title="Guardar">
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => guardarTarjeta(r.id)}
                                  disabled={r._saving}
                                >
                                  <SaveIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Cancelar">
                                <IconButton size="small" onClick={() => cancelarEdicion(r.id)} disabled={r._saving}>
                                  <CloseIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          )}
                        </Box>
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 0.75 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 0 }}>
                            <PlaceIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                            {!r._editando ? (
                              <Chip
                                label={getUbicacionNombre(r.ubicacion) || 'Sin ubicación'}
                                size="small"
                                variant="outlined"
                                sx={{
                                  maxWidth: '100%',
                                  '& .MuiChip-label': {
                                    px: 0.75,
                                    py: 0,
                                    fontSize: 11,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                  },
                                }}
                              />
                            ) : (
                              <Select
                                size="small"
                                fullWidth
                                value={r.ubicacionId ?? ''}
                                onChange={(e) => {
                                  const v = e.target.value as number | '';
                                  handleCampo(r.id, 'ubicacionId', v === '' ? null : Number(v));
                                }}
                                disabled={!isPremium || r._saving}
                                sx={{ '& .MuiSelect-select': { py: 0.5, fontSize: 12 } }}
                              >
                                <MenuItem value="">Sin ubicación</MenuItem>
                                {ubicaciones.map((u) => (
                                  <MenuItem key={u.id} value={u.id}>
                                    {u.nombre}
                                  </MenuItem>
                                ))}
                              </Select>
                            )}
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 0 }}>
                            <BuildIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                            {!r._editando ? (
                              <Typography variant="caption" noWrap>
                                {getMecanicoNombre(r.mecanico)}
                              </Typography>
                            ) : (
                              <Select
                                size="small"
                                fullWidth
                                value={r.mecanicoId ?? ''}
                                onChange={(e) => {
                                  const v = e.target.value as number | '';
                                  handleCampo(r.id, 'mecanicoId', v === '' ? null : Number(v));
                                }}
                                disabled={r._saving}
                                sx={{ '& .MuiSelect-select': { py: 0.5, fontSize: 12 } }}
                              >
                                <MenuItem value="">Sin asignar</MenuItem>
                                {mecanicos.map((m) => (
                                  <MenuItem key={m.id} value={m.id}>
                                    {m.usuario?.nombre ?? 'Mecánico'}
                                  </MenuItem>
                                ))}
                              </Select>
                            )}
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                            <CalendarMonthIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                            {!r._editando ? (
                              <Typography variant="caption" color="text.secondary">
                                {formatFecha(r.fechaEntrada)}
                              </Typography>
                            ) : (
                              <TextField
                                type="datetime-local"
                                size="small"
                                fullWidth
                                value={r.fechaEntrada ? new Date(r.fechaEntrada).toISOString().slice(0, 16) : ''}
                                onChange={(e) => {
                                  if (e.target.value)
                                    handleCampo(r.id, 'fechaEntrada', new Date(e.target.value).toISOString());
                                }}
                                disabled={r._saving}
                                inputProps={{ style: { fontSize: 12, padding: '4px 8px' } }}
                              />
                            )}
                          </Box>
                          <Box>
                            <Select
                              size="small"
                              fullWidth
                              value={r.estado}
                              onChange={(e) => {
                                const nuevo = e.target.value as EstadoReparacion;
                                if (r._editando) {
                                  handleCampo(r.id, 'estado', nuevo);
                                } else {
                                  handleCampo(r.id, 'estado', nuevo);
                                  patchReparacion(r.id, { estado: nuevo })
                                    .then(() => fetchData())
                                    .catch((err) => setErrorMsg(getErrorMessage(err, 'Error al cambiar estado')));
                                }
                              }}
                              disabled={r._saving}
                              sx={{ '& .MuiSelect-select': { py: 0.5, fontSize: 12 } }}
                            >
                              {columnasEstados.map((e) => (
                                <MenuItem key={e} value={e}>
                                  {estadoLabels[e]}
                                </MenuItem>
                              ))}
                            </Select>
                          </Box>
                        </Box>
                        <Box>
                          {!r._editando ? (
                            r.observaciones && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ display: 'block', whiteSpace: 'pre-wrap', lineHeight: 1.3 }}
                              >
                                {r.observaciones}
                              </Typography>
                            )
                          ) : (
                            <TextField
                              size="small"
                              fullWidth
                              multiline
                              minRows={1}
                              maxRows={3}
                              placeholder="Observaciones..."
                              value={r.observaciones ?? ''}
                              onChange={(e) => handleCampo(r.id, 'observaciones', e.target.value)}
                              disabled={r._saving}
                              inputProps={{ style: { fontSize: 12 } }}
                            />
                          )}
                        </Box>
                        <Divider />
                        <Box>
                          <Button
                            size="small"
                            fullWidth
                            variant="text"
                            onClick={() => toggleExpandPiezas(r.id)}
                            endIcon={
                              r._expandPiezas ? (
                                <ExpandLessIcon fontSize="small" />
                              ) : (
                                <ExpandMoreIcon fontSize="small" />
                              )
                            }
                            startIcon={<BuildIcon fontSize="small" />}
                            sx={{ justifyContent: 'space-between', textTransform: 'none', fontSize: 11, py: 0.25 }}
                          >
                            Repuestos usados ({r._detalles?.length ?? 0})
                          </Button>
                          <Collapse in={r._expandPiezas}>
                            <Box sx={{ mt: 1 }}>
                              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1 }}>
                                <Table size="small" padding="none">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell sx={{ fontSize: 10, py: 0.5, px: 0.75 }}>Pieza</TableCell>
                                      <TableCell align="center" sx={{ fontSize: 10, py: 0.5, px: 0.5, width: 50 }}>
                                        Cant.
                                      </TableCell>
                                      <TableCell align="right" sx={{ fontSize: 10, py: 0.5, px: 0.5, width: 70 }}>
                                        Subtotal
                                      </TableCell>
                                      <TableCell align="center" sx={{ width: 28, py: 0.5, px: 0.25 }} />
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {(r._detalles || []).length === 0 ? (
                                      <TableRow>
                                        <TableCell colSpan={4} align="center" sx={{ py: 1 }}>
                                          <Typography variant="caption" color="text.secondary">
                                            Sin repuestos
                                          </Typography>
                                        </TableCell>
                                      </TableRow>
                                    ) : (
                                      (r._detalles || []).map((d) => (
                                        <TableRow key={d.id ?? d.piezaId}>
                                          <TableCell sx={{ fontSize: 11, py: 0.5, px: 0.75, maxWidth: 140 }}>
                                            <Typography variant="caption" noWrap sx={{ display: 'block' }}>
                                              {d.pieza?.nombre || d.descripcion || `Pieza #${d.piezaId}`}
                                            </Typography>
                                            {d.pieza?.codigo && (
                                              <Typography variant="caption" color="text.secondary">
                                                {d.pieza.codigo}
                                              </Typography>
                                            )}
                                          </TableCell>
                                          <TableCell align="center" sx={{ fontSize: 11, py: 0.5, px: 0.25 }}>
                                            {d.cantidad}
                                          </TableCell>
                                          <TableCell align="right" sx={{ fontSize: 11, py: 0.5, px: 0.5 }}>
                                            {formatMoney(d.cantidad * d.precioUnitario)}
                                          </TableCell>
                                          <TableCell align="center" sx={{ py: 0.25, px: 0.25 }}>
                                            <IconButton
                                              size="small"
                                              color="error"
                                              onClick={() => handleRemoveDetalle(r.id, d.piezaId)}
                                              disabled={!r._editando || r._saving}
                                            >
                                              <DeleteIcon fontSize="inherit" />
                                            </IconButton>
                                          </TableCell>
                                        </TableRow>
                                      ))
                                    )}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                              {r._editando && (
                                <Box sx={{ mt: 1, display: 'flex', gap: 0.5, alignItems: 'flex-start' }}>
                                  <Autocomplete
                                    size="small"
                                    fullWidth
                                    options={piezas}
                                    getOptionLabel={(p) => `${p.codigo} - ${p.nombre} (Stock: ${p.stock})`}
                                    filterOptions={(opts, { inputValue }) =>
                                      opts.filter(
                                        (p) =>
                                          p.nombre.toLowerCase().includes(inputValue.toLowerCase()) ||
                                          p.codigo.toLowerCase().includes(inputValue.toLowerCase()),
                                      )
                                    }
                                    onChange={(_, val) => {
                                      if (val) {
                                        handleAddDetalle(r.id, val, 1);
                                      }
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        placeholder="Agregar repuesto..."
                                        inputProps={{ ...params.inputProps, style: { fontSize: 11 } }}
                                      />
                                    )}
                                    disabled={r._saving}
                                  />
                                </Box>
                              )}
                            </Box>
                          </Collapse>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                ))
              )}
            </Stack>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
