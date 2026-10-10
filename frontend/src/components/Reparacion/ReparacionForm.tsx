import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  MenuItem,
  Box,
  Alert,
  Autocomplete,
  Typography,
  Stack,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  createReparacion,
  updateReparacion,
  getServiciosReparacion,
  addServicioReparacion,
  updateServicioReparacion,
  removeServicioReparacion,
} from '../../api/reparacionApi';
import { getVehiculosByCliente, createVehiculo, getVehiculo } from '../../api/vehiculoApi';
import { getMecanicos } from '../../api/mecanicoApi';
import { getClientes, createCliente } from '../../api/clienteApi';
import { getServicios } from '../../api/servicioApi';
import { getPiezas } from '../../api/piezaApi';
import { getDetalles, addDetalle, updateDetalle, removeDetalle } from '../../api/detalleReparacionApi';
import { getErrorMessage } from '../../api/errorMessage';
import { useAuth } from '../../contexts/AuthContext';
import { Reparacion, Vehiculo, Mecanico, Cliente, Servicio, Pieza } from '../../types';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  initialData?: Reparacion | null;
}

interface ServiceLine {
  servicioId: number;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
}

interface PiezaLine {
  piezaId: number;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
}

const ReparacionForm = ({ open, onClose, onSave, initialData }: Props) => {
  const { user } = useAuth();
  const [descripcion, setDescripcion] = useState('');
  const [problemaReportado, setProblemaReportado] = useState('');
  const [diagnostico, setDiagnostico] = useState('');
  const [trabajosRealizados, setTrabajosRealizados] = useState('');
  const [costoManual, setCostoManual] = useState<number>(0);
  const [clienteId, setClienteId] = useState<number | ''>('');
  const [vehiculoId, setVehiculoId] = useState<number | ''>('');
  const [mecanicoId, setMecanicoId] = useState<number | ''>('');
  const [recepcionistaId, setRecepcionistaId] = useState<number | ''>('');
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [mecanicos, setMecanicos] = useState<Mecanico[]>([]);
  const [catalogo, setCatalogo] = useState<Servicio[]>([]);
  const [lines, setLines] = useState<ServiceLine[]>([]);
  const [originalLines, setOriginalLines] = useState<ServiceLine[]>([]);
  const [servicioSel, setServicioSel] = useState<Servicio | null>(null);
  const [cantidadSel, setCantidadSel] = useState<number>(1);
  const [piezasCatalogo, setPiezasCatalogo] = useState<Pieza[]>([]);
  const [piezaLines, setPiezaLines] = useState<PiezaLine[]>([]);
  const [originalPiezaLines, setOriginalPiezaLines] = useState<PiezaLine[]>([]);
  const [piezaSel, setPiezaSel] = useState<Pieza | null>(null);
  const [cantidadPieza, setCantidadPieza] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorMsg, setErrorMsg] = useState('');

  const [showNewCliente, setShowNewCliente] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState({ nombre: '', telefono: '', rut: '' });
  const [savingCliente, setSavingCliente] = useState(false);

  const [showNewVehiculo, setShowNewVehiculo] = useState(false);
  const [nuevoVehiculo, setNuevoVehiculo] = useState({
    marca: '',
    modelo: '',
    patente: '',
    anio: '',
    kilometraje: '',
  });
  const [savingVehiculo, setSavingVehiculo] = useState(false);

  const manoObra = lines.reduce((sum, l) => sum + l.cantidad * l.precioUnitario, 0);
  const totalPiezas = piezaLines.reduce((sum, l) => sum + l.cantidad * l.precioUnitario, 0);

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setErrorMsg('');
    setShowNewCliente(false);
    setShowNewVehiculo(false);
    setNuevoCliente({ nombre: '', telefono: '', rut: '' });
    setNuevoVehiculo({ marca: '', modelo: '', patente: '', anio: '', kilometraje: '' });
    setServicioSel(null);
    setCantidadSel(1);

    if (initialData) {
      setDescripcion(initialData.descripcion || '');
      setProblemaReportado(initialData.problemaReportado || '');
      setDiagnostico(initialData.diagnostico || '');
      setTrabajosRealizados(initialData.trabajosRealizados || '');
      setCostoManual(initialData.costoManoObra ?? 0);
      setVehiculoId(initialData.vehiculoId || '');
      setMecanicoId(initialData.mecanicoId ?? '');
      setRecepcionistaId(initialData.recepcionistaId || user?.id || '');
      if (initialData.vehiculo?.clienteId) {
        setClienteId(initialData.vehiculo.clienteId);
      } else if (initialData.vehiculoId) {
        getVehiculo(initialData.vehiculoId)
          .then((res) => setClienteId(res.data.clienteId))
          .catch(() => undefined);
      } else {
        setClienteId('');
      }

      const toLines = (servs: Servicio[] | undefined, rs: Reparacion['servicios']): ServiceLine[] =>
        (rs || []).map((r) => ({
          servicioId: r.servicioId,
          nombre: r.servicio?.nombre || `Servicio ${r.servicioId}`,
          cantidad: r.cantidad,
          precioUnitario: r.precioUnitario,
        }));

      if (initialData.servicios) {
        const l = toLines(undefined, initialData.servicios);
        setLines(l);
        setOriginalLines(l);
      } else {
        getServiciosReparacion(initialData.id)
          .then((res) => {
            const l = toLines(undefined, res.data);
            setLines(l);
            setOriginalLines(l);
          })
          .catch(() => {
            setLines([]);
            setOriginalLines([]);
          });
      }

      getDetalles(initialData.id)
        .then((res) => {
          const l = res.data.map((d) => ({
            piezaId: d.piezaId,
            nombre: d.pieza?.nombre || `Pieza ${d.piezaId}`,
            cantidad: d.cantidad,
            precioUnitario: d.precioUnitario,
          }));
          setPiezaLines(l);
          setOriginalPiezaLines(l);
        })
        .catch(() => {
          setPiezaLines([]);
          setOriginalPiezaLines([]);
        });
    } else {
      setDescripcion('');
      setProblemaReportado('');
      setDiagnostico('');
      setTrabajosRealizados('');
      setCostoManual(0);
      setClienteId('');
      setVehiculoId('');
      setMecanicoId('');
      setRecepcionistaId(user?.id ?? '');
      setLines([]);
      setOriginalLines([]);
      setPiezaLines([]);
      setOriginalPiezaLines([]);
    }
  }, [open, initialData, user]);

  useEffect(() => {
    if (!open) return;
    getMecanicos()
      .then((res) => setMecanicos(res.data))
      .catch((err) => setErrorMsg(getErrorMessage(err, 'No se pudieron cargar los mecánicos')));
    getClientes()
      .then((res) => setClientes(res.data))
      .catch((err) => setErrorMsg(getErrorMessage(err, 'No se pudieron cargar los clientes')));
    getServicios()
      .then((res) => setCatalogo(res.data))
      .catch((err) => setErrorMsg(getErrorMessage(err, 'No se pudo cargar el catálogo de servicios')));
    getPiezas()
      .then((res) => setPiezasCatalogo(res.data))
      .catch((err) => setErrorMsg(getErrorMessage(err, 'No se pudo cargar el catálogo de piezas')));
  }, [open]);

  useEffect(() => {
    if (!open || !clienteId) {
      setVehiculos([]);
      return;
    }
    getVehiculosByCliente(Number(clienteId))
      .then((res) => setVehiculos(res.data))
      .catch((err) => {
        setVehiculos([]);
        setErrorMsg(getErrorMessage(err, 'No se pudieron cargar los vehículos del cliente'));
      });
  }, [open, clienteId]);

  const handleAddServicio = () => {
    if (!servicioSel) return;
    const cant = Math.max(1, Number(cantidadSel) || 1);
    setLines((prev) => {
      const existing = prev.find((l) => l.servicioId === servicioSel.id);
      if (existing) {
        return prev.map((l) => (l.servicioId === servicioSel.id ? { ...l, cantidad: l.cantidad + cant } : l));
      }
      return [
        ...prev,
        {
          servicioId: servicioSel.id,
          nombre: servicioSel.nombre,
          cantidad: cant,
          precioUnitario: servicioSel.precioBase,
        },
      ];
    });
    if (!descripcion.trim() && servicioSel.descripcion) setDescripcion(servicioSel.descripcion);
    if (!problemaReportado.trim() && servicioSel.problemaReportado) setProblemaReportado(servicioSel.problemaReportado);
    if (!diagnostico.trim() && servicioSel.diagnostico) setDiagnostico(servicioSel.diagnostico);
    if (!trabajosRealizados.trim() && servicioSel.trabajosRealizados)
      setTrabajosRealizados(servicioSel.trabajosRealizados);
    setServicioSel(null);
    setCantidadSel(1);
  };

  const handleCantidadLinea = (servicioId: number, cantidad: number) => {
    setLines((prev) =>
      prev.map((l) => (l.servicioId === servicioId ? { ...l, cantidad: Math.max(1, cantidad || 1) } : l)),
    );
  };

  const handleRemoveLinea = (servicioId: number) => {
    setLines((prev) => prev.filter((l) => l.servicioId !== servicioId));
  };

  const handleAddPieza = () => {
    if (!piezaSel) return;
    const cant = Math.max(1, Number(cantidadPieza) || 1);
    setPiezaLines((prev) => {
      const existing = prev.find((l) => l.piezaId === piezaSel.id);
      if (existing) {
        return prev.map((l) => (l.piezaId === piezaSel.id ? { ...l, cantidad: l.cantidad + cant } : l));
      }
      return [
        ...prev,
        {
          piezaId: piezaSel.id,
          nombre: piezaSel.nombre,
          cantidad: cant,
          precioUnitario: piezaSel.precio,
        },
      ];
    });
    setPiezaSel(null);
    setCantidadPieza(1);
  };

  const handleCantidadPiezaLinea = (piezaId: number, cantidad: number) => {
    setPiezaLines((prev) =>
      prev.map((l) => (l.piezaId === piezaId ? { ...l, cantidad: Math.max(1, cantidad || 1) } : l)),
    );
  };

  const handleRemovePiezaLinea = (piezaId: number) => {
    setPiezaLines((prev) => prev.filter((l) => l.piezaId !== piezaId));
  };

  const handleCreateCliente = async () => {
    if (!nuevoCliente.nombre.trim()) return;
    try {
      setSavingCliente(true);
      setErrorMsg('');
      const res = await createCliente({
        nombre: nuevoCliente.nombre.trim(),
        telefono: nuevoCliente.telefono.trim() || undefined,
        rut: nuevoCliente.rut.trim() || undefined,
      });
      const created = res.data;
      setClientes((prev) => [...prev, created]);
      setClienteId(created.id);
      setVehiculoId('');
      setShowNewCliente(false);
      setNuevoCliente({ nombre: '', telefono: '', rut: '' });
    } catch (err) {
      setErrorMsg(getErrorMessage(err, 'No se pudo crear el cliente'));
    } finally {
      setSavingCliente(false);
    }
  };

  const handleCreateVehiculo = async () => {
    if (!clienteId) return;
    if (!nuevoVehiculo.marca.trim() || !nuevoVehiculo.modelo.trim() || !nuevoVehiculo.patente.trim()) return;
    try {
      setSavingVehiculo(true);
      setErrorMsg('');
      const res = await createVehiculo({
        marca: nuevoVehiculo.marca.trim(),
        modelo: nuevoVehiculo.modelo.trim(),
        patente: nuevoVehiculo.patente.trim(),
        anio: nuevoVehiculo.anio === '' ? undefined : Number(nuevoVehiculo.anio),
        kilometraje: nuevoVehiculo.kilometraje === '' ? undefined : Number(nuevoVehiculo.kilometraje),
        clienteId: Number(clienteId),
      });
      const created = res.data;
      setVehiculos((prev) => [...prev, created]);
      setVehiculoId(created.id);
      setShowNewVehiculo(false);
      setNuevoVehiculo({ marca: '', modelo: '', patente: '', anio: '', kilometraje: '' });
    } catch (err) {
      setErrorMsg(getErrorMessage(err, 'No se pudo crear el vehículo'));
    } finally {
      setSavingVehiculo(false);
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!descripcion.trim()) errs.descripcion = 'El resumen es requerido';
    if (!vehiculoId) errs.vehiculoId = 'Debe seleccionar un vehículo';
    if (!recepcionistaId) errs.recepcionistaId = 'No se pudo determinar el recepcionista';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const basePayload = {
      descripcion: descripcion.trim(),
      problemaReportado: problemaReportado.trim() || null,
      diagnostico: diagnostico.trim() || null,
      trabajosRealizados: trabajosRealizados.trim() || null,
      costoManoObra: lines.length > 0 ? manoObra : costoManual,
      vehiculoId: Number(vehiculoId),
      mecanicoId: mecanicoId === '' ? null : Number(mecanicoId),
      recepcionistaId: Number(recepcionistaId),
    };

    try {
      setLoading(true);
      setErrorMsg('');

      if (initialData) {
        await updateReparacion(initialData.id, basePayload);
        for (const orig of originalLines) {
          if (!lines.some((l) => l.servicioId === orig.servicioId)) {
            await removeServicioReparacion(initialData.id, orig.servicioId);
          }
        }
        for (const line of lines) {
          const orig = originalLines.find((o) => o.servicioId === line.servicioId);
          if (!orig) {
            await addServicioReparacion(initialData.id, line.servicioId, line.cantidad);
          } else if (orig.cantidad !== line.cantidad) {
            await updateServicioReparacion(initialData.id, line.servicioId, line.cantidad);
          }
        }
        for (const orig of originalPiezaLines) {
          if (!piezaLines.some((l) => l.piezaId === orig.piezaId)) {
            await removeDetalle(initialData.id, orig.piezaId);
          }
        }
        for (const line of piezaLines) {
          const orig = originalPiezaLines.find((o) => o.piezaId === line.piezaId);
          if (!orig) {
            await addDetalle({
              reparacionId: initialData.id,
              piezaId: line.piezaId,
              cantidad: line.cantidad,
              precioUnitario: line.precioUnitario,
            });
          } else if (orig.cantidad !== line.cantidad) {
            await updateDetalle(initialData.id, line.piezaId, { cantidad: line.cantidad });
          }
        }
      } else {
        const res = await createReparacion(basePayload);
        const newId = res.data.id;
        for (const line of lines) {
          await addServicioReparacion(newId, line.servicioId, line.cantidad);
        }
        for (const line of piezaLines) {
          await addDetalle({
            reparacionId: newId,
            piezaId: line.piezaId,
            cantidad: line.cantidad,
            precioUnitario: line.precioUnitario,
          });
        }
      }

      onSave();
      onClose();
    } catch (err) {
      setErrorMsg(getErrorMessage(err, 'Error al guardar la reparación'));
    } finally {
      setLoading(false);
    }
  };

  const clienteSeleccionado = clientes.find((c) => c.id === clienteId) || null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{initialData ? 'Editar Reparación' : 'Nueva Reparación'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          {errorMsg && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMsg('')}>
              {errorMsg}
            </Alert>
          )}

          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            1. Cliente y vehículo
          </Typography>

          <Stack direction="row" spacing={1} alignItems="flex-start">
            <Autocomplete
              fullWidth
              options={clientes}
              value={clienteSeleccionado}
              onChange={(_, value) => {
                setClienteId(value ? value.id : '');
                setVehiculoId('');
                setShowNewVehiculo(false);
              }}
              getOptionLabel={(c) => `${c.nombre}${c.rut ? ` · ${c.rut}` : ''}${c.telefono ? ` · ${c.telefono}` : ''}`}
              isOptionEqualToValue={(a, b) => a.id === b.id}
              renderInput={(params) => (
                <TextField {...params} label="Buscar cliente" margin="normal" placeholder="Nombre, RUT o teléfono" />
              )}
            />
            <Button
              sx={{ mt: 2, whiteSpace: 'nowrap' }}
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => setShowNewCliente((v) => !v)}
            >
              {showNewCliente ? 'Cancelar' : 'Nuevo'}
            </Button>
          </Stack>

          {showNewCliente && (
            <Box sx={{ p: 2, mb: 1, bgcolor: 'grey.50', borderRadius: 2 }}>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                Nuevo cliente
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                <TextField
                  label="Nombre"
                  value={nuevoCliente.nombre}
                  onChange={(e) => setNuevoCliente((p) => ({ ...p, nombre: e.target.value }))}
                  fullWidth
                  required
                />
                <TextField
                  label="Teléfono"
                  value={nuevoCliente.telefono}
                  onChange={(e) => setNuevoCliente((p) => ({ ...p, telefono: e.target.value }))}
                  fullWidth
                />
                <TextField
                  label="RUT"
                  value={nuevoCliente.rut}
                  onChange={(e) => setNuevoCliente((p) => ({ ...p, rut: e.target.value }))}
                  fullWidth
                  placeholder="12.345.678-9"
                />
              </Stack>
              <Button
                variant="contained"
                size="small"
                sx={{ mt: 1 }}
                onClick={handleCreateCliente}
                disabled={savingCliente || !nuevoCliente.nombre.trim()}
              >
                {savingCliente ? <CircularProgress size={18} /> : 'Guardar cliente'}
              </Button>
            </Box>
          )}

          <Stack direction="row" spacing={1} alignItems="flex-start">
            <TextField
              select
              label="Vehículo"
              value={vehiculoId}
              onChange={(e) => setVehiculoId(e.target.value === '' ? '' : Number(e.target.value))}
              fullWidth
              margin="normal"
              required
              disabled={!clienteId}
              error={!!errors.vehiculoId}
              helperText={errors.vehiculoId || (!clienteId ? 'Seleccioná un cliente primero' : undefined)}
            >
              <MenuItem value="">-- Seleccione --</MenuItem>
              {vehiculos.map((v) => (
                <MenuItem key={v.id} value={v.id}>
                  {v.patente} — {v.marca} {v.modelo}
                </MenuItem>
              ))}
            </TextField>
            <Button
              sx={{ mt: 2, whiteSpace: 'nowrap' }}
              startIcon={<AddCircleOutlineIcon />}
              disabled={!clienteId}
              onClick={() => setShowNewVehiculo((v) => !v)}
            >
              {showNewVehiculo ? 'Cancelar' : 'Nuevo'}
            </Button>
          </Stack>

          {showNewVehiculo && clienteId && (
            <Box sx={{ p: 2, mb: 1, bgcolor: 'grey.50', borderRadius: 2 }}>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                Nuevo vehículo de {clienteSeleccionado?.nombre}
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mb: 1 }}>
                <TextField
                  label="Marca"
                  value={nuevoVehiculo.marca}
                  onChange={(e) => setNuevoVehiculo((p) => ({ ...p, marca: e.target.value }))}
                  fullWidth
                  required
                />
                <TextField
                  label="Modelo"
                  value={nuevoVehiculo.modelo}
                  onChange={(e) => setNuevoVehiculo((p) => ({ ...p, modelo: e.target.value }))}
                  fullWidth
                  required
                />
                <TextField
                  label="Patente"
                  value={nuevoVehiculo.patente}
                  onChange={(e) => setNuevoVehiculo((p) => ({ ...p, patente: e.target.value }))}
                  fullWidth
                  required
                />
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                <TextField
                  label="Año"
                  type="number"
                  value={nuevoVehiculo.anio}
                  onChange={(e) => setNuevoVehiculo((p) => ({ ...p, anio: e.target.value }))}
                  fullWidth
                />
                <TextField
                  label="Kilometraje"
                  type="number"
                  value={nuevoVehiculo.kilometraje}
                  onChange={(e) => setNuevoVehiculo((p) => ({ ...p, kilometraje: e.target.value }))}
                  fullWidth
                />
              </Stack>
              <Button
                variant="contained"
                size="small"
                sx={{ mt: 1 }}
                onClick={handleCreateVehiculo}
                disabled={
                  savingVehiculo ||
                  !nuevoVehiculo.marca.trim() ||
                  !nuevoVehiculo.modelo.trim() ||
                  !nuevoVehiculo.patente.trim()
                }
              >
                {savingVehiculo ? <CircularProgress size={18} /> : 'Guardar vehículo'}
              </Button>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            2. Servicios a realizar
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="flex-start" sx={{ mb: 1 }}>
            <Autocomplete
              fullWidth
              options={catalogo}
              value={servicioSel}
              onChange={(_, value) => setServicioSel(value)}
              getOptionLabel={(s) => `${s.nombre} · $${Number(s.precioBase).toFixed(2)}`}
              isOptionEqualToValue={(a, b) => a.id === b.id}
              renderInput={(params) => (
                <TextField {...params} label="Servicio" placeholder="Buscar servicio del catálogo" />
              )}
            />
            <TextField
              label="Cantidad"
              type="number"
              value={cantidadSel}
              onChange={(e) => setCantidadSel(Math.max(1, Number(e.target.value) || 1))}
              sx={{ width: 110 }}
              slotProps={{ htmlInput: { min: 1 } }}
            />
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              onClick={handleAddServicio}
              disabled={!servicioSel}
              sx={{ whiteSpace: 'nowrap', height: 56 }}
            >
              Agregar
            </Button>
          </Stack>

          <TableContainer sx={{ mb: 1 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Servicio</TableCell>
                  <TableCell align="center" width={110}>
                    Cantidad
                  </TableCell>
                  <TableCell align="right">Precio Unit.</TableCell>
                  <TableCell align="right">Subtotal</TableCell>
                  <TableCell align="center" width={60} />
                </TableRow>
              </TableHead>
              <TableBody>
                {lines.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                        Sin servicios cargados. Podés ingresar la mano de obra manualmente abajo.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  lines.map((l) => (
                    <TableRow key={l.servicioId}>
                      <TableCell>{l.nombre}</TableCell>
                      <TableCell align="center">
                        <TextField
                          type="number"
                          size="small"
                          value={l.cantidad}
                          onChange={(e) => handleCantidadLinea(l.servicioId, Number(e.target.value))}
                          slotProps={{ htmlInput: { min: 1, style: { textAlign: 'center' } } }}
                        />
                      </TableCell>
                      <TableCell align="right">${Number(l.precioUnitario).toFixed(2)}</TableCell>
                      <TableCell align="right">
                        <Typography fontWeight={600}>${(l.cantidad * l.precioUnitario).toFixed(2)}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton size="small" color="error" onClick={() => handleRemoveLinea(l.servicioId)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {lines.length > 0 ? (
            <Box sx={{ textAlign: 'right', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Mano de obra (calculada): <strong>${manoObra.toFixed(2)}</strong>
              </Typography>
            </Box>
          ) : (
            <TextField
              label="Costo Mano de Obra"
              type="number"
              value={costoManual}
              onChange={(e) => setCostoManual(Number(e.target.value) || 0)}
              fullWidth
              margin="normal"
              helperText="Sin servicios cargados, ingresá la mano de obra manualmente."
              slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
            />
          )}

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            3. Piezas y repuestos
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="flex-start" sx={{ mb: 1 }}>
            <Autocomplete
              fullWidth
              options={piezasCatalogo}
              value={piezaSel}
              onChange={(_, value) => setPiezaSel(value)}
              getOptionLabel={(p) => `${p.nombre} · $${Number(p.precio).toFixed(2)}`}
              isOptionEqualToValue={(a, b) => a.id === b.id}
              renderInput={(params) => <TextField {...params} label="Pieza" placeholder="Buscar pieza del catálogo" />}
            />
            <TextField
              label="Cantidad"
              type="number"
              value={cantidadPieza}
              onChange={(e) => setCantidadPieza(Math.max(1, Number(e.target.value) || 1))}
              sx={{ width: 110 }}
              slotProps={{ htmlInput: { min: 1 } }}
            />
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              onClick={handleAddPieza}
              disabled={!piezaSel}
              sx={{ whiteSpace: 'nowrap', height: 56 }}
            >
              Agregar
            </Button>
          </Stack>

          <TableContainer sx={{ mb: 1 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Pieza</TableCell>
                  <TableCell align="center" width={110}>
                    Cantidad
                  </TableCell>
                  <TableCell align="right">Precio Unit.</TableCell>
                  <TableCell align="right">Subtotal</TableCell>
                  <TableCell align="center" width={60} />
                </TableRow>
              </TableHead>
              <TableBody>
                {piezaLines.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                        Sin piezas cargadas.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  piezaLines.map((l) => (
                    <TableRow key={l.piezaId}>
                      <TableCell>{l.nombre}</TableCell>
                      <TableCell align="center">
                        <TextField
                          type="number"
                          size="small"
                          value={l.cantidad}
                          onChange={(e) => handleCantidadPiezaLinea(l.piezaId, Number(e.target.value))}
                          slotProps={{ htmlInput: { min: 1, style: { textAlign: 'center' } } }}
                        />
                      </TableCell>
                      <TableCell align="right">${Number(l.precioUnitario).toFixed(2)}</TableCell>
                      <TableCell align="right">
                        <Typography fontWeight={600}>${(l.cantidad * l.precioUnitario).toFixed(2)}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton size="small" color="error" onClick={() => handleRemovePiezaLinea(l.piezaId)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {piezaLines.length > 0 && (
            <Box sx={{ textAlign: 'right', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Total repuestos: <strong>${totalPiezas.toFixed(2)}</strong>
              </Typography>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            4. Descripción del trabajo
          </Typography>

          <TextField
            label="Resumen"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            fullWidth
            required
            margin="normal"
            error={!!errors.descripcion}
            helperText={errors.descripcion || 'Se autocompleta al agregar un servicio.'}
          />

          <TextField
            label="Problema reportado por el cliente"
            value={problemaReportado}
            onChange={(e) => setProblemaReportado(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={2}
          />

          <TextField
            label="Diagnóstico técnico"
            value={diagnostico}
            onChange={(e) => setDiagnostico(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={2}
          />

          <TextField
            label="Trabajos realizados"
            value={trabajosRealizados}
            onChange={(e) => setTrabajosRealizados(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={2}
          />

          <TextField
            select
            label="Mecánico (opcional)"
            value={mecanicoId}
            onChange={(e) => setMecanicoId(e.target.value === '' ? '' : Number(e.target.value))}
            fullWidth
            margin="normal"
          >
            <MenuItem value="">-- Ninguno --</MenuItem>
            {mecanicos.map((m) => (
              <MenuItem key={m.id} value={m.id}>
                {m.usuario?.nombre || `Mecánico ${m.id}`}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={20} /> : initialData ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default ReparacionForm;
