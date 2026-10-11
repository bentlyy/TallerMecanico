import { useEffect, useState } from 'react';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  Chip,
  Collapse,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
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
import { patchReparacion } from '../../api/reparacionApi';
import { addDetalle, getDetalles, removeDetalle } from '../../api/detalleReparacionApi';
import { getErrorMessage } from '../../api/errorMessage';
import { useAuth } from '../../contexts/AuthContext';
import type { DetalleReparacion, EstadoReparacion, Mecanico, Pieza, Reparacion, Ubicacion } from '../../types';
import { estadoColors, estadoLabels } from './estadoReparacion';

interface EditableReparacion extends Reparacion {
  _editando?: boolean;
  _expandPiezas?: boolean;
  _detalles?: DetalleReparacion[];
  _saving?: boolean;
}

interface Props {
  reparaciones: Reparacion[];
  mecanicos: Mecanico[];
  ubicaciones: Ubicacion[];
  piezas: Pieza[];
  onChanged: () => void;
}

const columnasEstados: EstadoReparacion[] = [
  'EN_REVISION',
  'EN_REPARACION',
  'TERMINADO',
  'ENTREGADO',
  'FACTURADO',
  'PAGADO',
];

const inicializar = (reparaciones: Reparacion[]): EditableReparacion[] =>
  reparaciones.map((r) => ({ ...r, _editando: false, _expandPiezas: false, _detalles: [], _saving: false }));

export default function OperationsBoard({ reparaciones, mecanicos, ubicaciones, piezas, onChanged }: Props) {
  const { user } = useAuth();
  const isPremium = user?.plan === 'PREMIUM';
  const [items, setItems] = useState<EditableReparacion[]>(() => inicializar(reparaciones));
  const [colapsadas, setColapsadas] = useState<Partial<Record<EstadoReparacion, boolean>>>({});
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setItems(inicializar(reparaciones));
  }, [reparaciones]);

  useEffect(() => {
    setColapsadas((prev) => {
      let changed = false;
      const next = { ...prev };
      for (const estado of columnasEstados) {
        if (next[estado] === undefined) {
          next[estado] = reparaciones.filter((r) => r.estado === estado).length === 0;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [reparaciones]);

  const total = reparaciones.length;
  const todasColapsadas = columnasEstados.every((e) => !!colapsadas[e]);

  const toggleColumna = (estado: EstadoReparacion) => {
    setColapsadas((prev) => ({ ...prev, [estado]: !prev[estado] }));
  };

  const setTodas = (valor: boolean) => {
    setColapsadas(() => {
      const next: Partial<Record<EstadoReparacion, boolean>> = {};
      for (const e of columnasEstados) next[e] = valor;
      return next;
    });
  };

  const porEstado = (estado: EstadoReparacion) => items.filter((r) => r.estado === estado);

  const toggleEditar = async (id: number) => {
    setItems((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          if (!r._editando) {
            getDetalles(id)
              .then((d) => setItems((p2) => p2.map((x) => (x.id === id ? { ...x, _detalles: d.data } : x))))
              .catch(() => {});
          }
          return { ...r, _editando: !r._editando, _expandPiezas: r._editando ? false : r._expandPiezas };
        }
        return r;
      }),
    );
  };

  const handleCampo = (id: number, campo: keyof Reparacion, valor: unknown) => {
    setItems((prev) => prev.map((r) => (r.id === id ? { ...r, [campo]: valor } : r)));
  };

  const cancelarEdicion = () => {
    setItems(inicializar(reparaciones));
  };

  const guardarTarjeta = async (id: number) => {
    const rep = items.find((r) => r.id === id);
    if (!rep) return;
    try {
      setItems((prev) => prev.map((r) => (r.id === id ? { ...r, _saving: true } : r)));
      const payload: Partial<Reparacion> = {
        estado: rep.estado,
        mecanicoId: rep.mecanicoId ?? null,
        ubicacionId: rep.ubicacionId ?? null,
        fechaEntrada: rep.fechaEntrada,
        observaciones: rep.observaciones ?? null,
      };
      const res = await patchReparacion(id, payload);
      setItems((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, ...res.data, _editando: false, _expandPiezas: false, _saving: false } : r,
        ),
      );
      onChanged();
    } catch (err) {
      setErrorMsg(getErrorMessage(err, 'Error al guardar cambios'));
      setItems((prev) => prev.map((r) => (r.id === id ? { ...r, _saving: false } : r)));
    }
  };

  const toggleExpandPiezas = (id: number) => {
    setItems((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          if (!r._detalles?.length && !r._expandPiezas) {
            getDetalles(id)
              .then((d) => setItems((p2) => p2.map((x) => (x.id === id ? { ...x, _detalles: d.data } : x))))
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
      setItems((prev) => prev.map((r) => (r.id === reparacionId ? { ...r, _detalles: d.data } : r)));
    } catch (err) {
      setErrorMsg(getErrorMessage(err, 'Error al agregar repuesto'));
    }
  };

  const handleRemoveDetalle = async (reparacionId: number, piezaId: number) => {
    try {
      await removeDetalle(reparacionId, piezaId);
      const d = await getDetalles(reparacionId);
      setItems((prev) => prev.map((r) => (r.id === reparacionId ? { ...r, _detalles: d.data } : r)));
    } catch (err) {
      setErrorMsg(getErrorMessage(err, 'Error al eliminar repuesto'));
    }
  };

  const formatFecha = (v?: string | null) => {
    if (!v) return '-';
    try {
      return new Date(v).toLocaleString('es-AR', {
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

  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1,
          px: 2,
          py: 1.5,
        }}
      >
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Tablero de operaciones
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {total === 0
              ? 'Sin vehículos en el taller'
              : `${total} vehículo${total === 1 ? '' : 's'} · estado, ubicación, mecánico y repuestos por etapa`}
          </Typography>
        </Box>
        <Button
          size="small"
          onClick={() => setTodas(!todasColapsadas)}
          startIcon={todasColapsadas ? <ExpandMoreIcon /> : <ExpandLessIcon />}
          sx={{ textTransform: 'none' }}
        >
          {todasColapsadas ? 'Expandir todo' : 'Contraer todo'}
        </Button>
      </Box>
      <Divider />
      {errorMsg && (
        <Alert severity="error" onClose={() => setErrorMsg('')} sx={{ m: 1.5 }}>
          {errorMsg}
        </Alert>
      )}
      {columnasEstados.map((estado, index) => {
        const colapsada = !!colapsadas[estado];
        const lista = porEstado(estado);
        const count = lista.length;
        return (
          <Box key={estado}>
            {index > 0 && <Divider />}
            <Button
              fullWidth
              onClick={() => toggleColumna(estado)}
              sx={{
                justifyContent: 'space-between',
                textTransform: 'none',
                px: 2,
                py: 1,
                color: 'text.primary',
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0 }}>
                <Chip label={estadoLabels[estado]} color={estadoColors[estado]} size="small" />
                <Typography variant="body2" color="text.secondary">
                  {count}
                </Typography>
                {count === 0 && (
                  <Typography variant="caption" color="text.disabled">
                    vacío
                  </Typography>
                )}
              </Stack>
              {colapsada ? <ExpandMoreIcon fontSize="small" /> : <ExpandLessIcon fontSize="small" />}
            </Button>
            <Collapse in={!colapsada}>
              <Box sx={{ p: 1.5, bgcolor: 'action.hover' }}>
                {count === 0 ? (
                  <Typography
                    variant="caption"
                    color="text.disabled"
                    sx={{ display: 'block', textAlign: 'center', py: 2 }}
                  >
                    Sin vehículos en esta etapa
                  </Typography>
                ) : (
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' },
                      gap: 1.5,
                    }}
                  >
                    {lista.map((r) => (
                      <Card
                        key={r.id}
                        variant="outlined"
                        sx={{ borderRadius: 2, boxShadow: 'none', '&:hover': { borderColor: 'primary.main' } }}
                      >
                        <Box sx={{ p: 1.5 }}>
                          <Stack spacing={1.25}>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                justifyContent: 'space-between',
                                gap: 1,
                              }}
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
                                    <IconButton size="small" onClick={cancelarEdicion} disabled={r._saving}>
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
                                    label={r.ubicacion?.nombre || 'Sin ubicación'}
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
                                    {r.mecanico?.usuario?.nombre || 'Sin asignar'}
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
                                    handleCampo(r.id, 'estado', nuevo);
                                    if (!r._editando) {
                                      patchReparacion(r.id, { estado: nuevo })
                                        .then(() => onChanged())
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
                                sx={{
                                  justifyContent: 'space-between',
                                  textTransform: 'none',
                                  fontSize: 11,
                                  py: 0.25,
                                }}
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
                        </Box>
                      </Card>
                    ))}
                  </Box>
                )}
              </Box>
            </Collapse>
          </Box>
        );
      })}
    </Card>
  );
}
