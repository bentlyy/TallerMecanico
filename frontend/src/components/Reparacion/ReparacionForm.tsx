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
  Chip,
  Stack,
  Divider,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { createReparacion, updateReparacion } from '../../api/reparacionApi';
import { getVehiculosByCliente, createVehiculo, getVehiculo } from '../../api/vehiculoApi';
import { getMecanicos } from '../../api/mecanicoApi';
import { getClientes, createCliente } from '../../api/clienteApi';
import { getErrorMessage } from '../../api/errorMessage';
import { useAuth } from '../../contexts/AuthContext';
import { Reparacion, Vehiculo, Mecanico, Cliente } from '../../types';
import { SERVICE_TEMPLATES, ServiceTemplate } from '../../constants/reparacionTemplates';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  initialData?: Reparacion | null;
}

const ReparacionForm = ({ open, onClose, onSave, initialData }: Props) => {
  const { user } = useAuth();
  const [descripcion, setDescripcion] = useState('');
  const [problemaReportado, setProblemaReportado] = useState('');
  const [diagnostico, setDiagnostico] = useState('');
  const [trabajosRealizados, setTrabajosRealizados] = useState('');
  const [costoManoObra, setCostoManoObra] = useState<number>(0);
  const [clienteId, setClienteId] = useState<number | ''>('');
  const [vehiculoId, setVehiculoId] = useState<number | ''>('');
  const [mecanicoId, setMecanicoId] = useState<number | ''>('');
  const [recepcionistaId, setRecepcionistaId] = useState<number | ''>('');
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [mecanicos, setMecanicos] = useState<Mecanico[]>([]);
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

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setErrorMsg('');
    setShowNewCliente(false);
    setShowNewVehiculo(false);
    setNuevoCliente({ nombre: '', telefono: '', rut: '' });
    setNuevoVehiculo({ marca: '', modelo: '', patente: '', anio: '', kilometraje: '' });

    if (initialData) {
      setDescripcion(initialData.descripcion || '');
      setProblemaReportado(initialData.problemaReportado || '');
      setDiagnostico(initialData.diagnostico || '');
      setTrabajosRealizados(initialData.trabajosRealizados || '');
      setCostoManoObra(initialData.costoManoObra ?? 0);
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
    } else {
      setDescripcion('');
      setProblemaReportado('');
      setDiagnostico('');
      setTrabajosRealizados('');
      setCostoManoObra(0);
      setClienteId('');
      setVehiculoId('');
      setMecanicoId('');
      setRecepcionistaId(user?.id ?? '');
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

  const applyTemplate = (tpl: ServiceTemplate) => {
    setDescripcion(tpl.descripcion);
    setProblemaReportado(tpl.problemaReportado);
    setDiagnostico(tpl.diagnostico);
    setTrabajosRealizados(tpl.trabajosRealizados);
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
    if (costoManoObra < 0) errs.costoManoObra = 'El costo no puede ser negativo';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      descripcion: descripcion.trim(),
      problemaReportado: problemaReportado.trim() || null,
      diagnostico: diagnostico.trim() || null,
      trabajosRealizados: trabajosRealizados.trim() || null,
      costoManoObra,
      vehiculoId: Number(vehiculoId),
      mecanicoId: mecanicoId === '' ? null : Number(mecanicoId),
      recepcionistaId: Number(recepcionistaId),
    };

    try {
      setLoading(true);
      setErrorMsg('');
      if (initialData) {
        await updateReparacion(initialData.id, payload);
      } else {
        await createReparacion(payload);
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
            2. Trabajo a realizar
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            Plantillas rápidas (completan los campos de abajo):
          </Typography>
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mb: 1 }}>
            {SERVICE_TEMPLATES.map((tpl) => (
              <Chip
                key={tpl.label}
                label={tpl.label}
                onClick={() => applyTemplate(tpl)}
                variant="outlined"
                color="primary"
                size="small"
              />
            ))}
          </Stack>

          <TextField
            label="Resumen"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            fullWidth
            required
            margin="normal"
            error={!!errors.descripcion}
            helperText={
              errors.descripcion || 'Resumen breve del trabajo (ej: "Service de mantenimiento preventivo 45.000 km")'
            }
          />

          <TextField
            label="Problema reportado por el cliente"
            value={problemaReportado}
            onChange={(e) => setProblemaReportado(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={2}
            placeholder="Qué refiere el cliente: síntomas, ruidos, fallas previas..."
          />

          <TextField
            label="Diagnóstico técnico"
            value={diagnostico}
            onChange={(e) => setDiagnostico(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={2}
            placeholder="Hallazgos de la inspección y causa raíz del problema."
          />

          <TextField
            label="Trabajos realizados"
            value={trabajosRealizados}
            onChange={(e) => setTrabajosRealizados(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={2}
            placeholder="Repuestos y tareas ejecutadas durante la reparación."
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

          <TextField
            label="Costo Mano de Obra"
            type="number"
            value={costoManoObra}
            onChange={(e) => setCostoManoObra(Number(e.target.value) || 0)}
            fullWidth
            margin="normal"
            error={!!errors.costoManoObra}
            helperText={errors.costoManoObra}
            slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
          />
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
