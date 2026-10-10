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
} from '@mui/material';
import { createReparacion, updateReparacion } from '../../api/reparacionApi';
import { getVehiculos } from '../../api/vehiculoApi';
import { getMecanicos } from '../../api/mecanicoApi';
import { getUsuarios } from '../../api/usuarioApi';
import { getErrorMessage } from '../../api/errorMessage';
import { Reparacion, Vehiculo, Mecanico, Usuario } from '../../types';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  initialData?: Reparacion | null;
}

const ReparacionForm = ({ open, onClose, onSave, initialData }: Props) => {
  const [descripcion, setDescripcion] = useState('');
  const [problemaReportado, setProblemaReportado] = useState('');
  const [diagnostico, setDiagnostico] = useState('');
  const [trabajosRealizados, setTrabajosRealizados] = useState('');
  const [costoManoObra, setCostoManoObra] = useState<number>(0);
  const [vehiculoId, setVehiculoId] = useState<number | ''>('');
  const [mecanicoId, setMecanicoId] = useState<number | ''>('');
  const [recepcionistaId, setRecepcionistaId] = useState<number | ''>('');
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [mecanicos, setMecanicos] = useState<Mecanico[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    Promise.all([getVehiculos(), getMecanicos(), getUsuarios()])
      .then(([vRes, mRes, uRes]) => {
        setVehiculos(vRes.data);
        setMecanicos(mRes.data);
        setUsuarios(uRes.data);
      })
      .catch((err) => setErrorMsg(getErrorMessage(err, 'No se pudieron cargar los datos')));
  }, []);

  useEffect(() => {
    setErrorMsg('');
    if (initialData) {
      setDescripcion(initialData.descripcion || '');
      setProblemaReportado(initialData.problemaReportado || '');
      setDiagnostico(initialData.diagnostico || '');
      setTrabajosRealizados(initialData.trabajosRealizados || '');
      setCostoManoObra(initialData.costoManoObra ?? 0);
      setVehiculoId(initialData.vehiculoId || '');
      setMecanicoId(initialData.mecanicoId ?? '');
      setRecepcionistaId(initialData.recepcionistaId || '');
    } else {
      setDescripcion('');
      setProblemaReportado('');
      setDiagnostico('');
      setTrabajosRealizados('');
      setCostoManoObra(0);
      setVehiculoId('');
      setMecanicoId('');
      setRecepcionistaId('');
    }
    setErrors({});
  }, [initialData, open]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!descripcion.trim()) errs.descripcion = 'La descripción es requerida';
    if (!vehiculoId) errs.vehiculoId = 'Debe seleccionar un vehículo';
    if (!recepcionistaId) errs.recepcionistaId = 'Debe seleccionar un recepcionista';
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
            autoFocus
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
            label="Vehículo"
            value={vehiculoId}
            onChange={(e) => setVehiculoId(e.target.value === '' ? '' : Number(e.target.value))}
            fullWidth
            required
            margin="normal"
            error={!!errors.vehiculoId}
            helperText={errors.vehiculoId}
          >
            <MenuItem value="">-- Seleccione --</MenuItem>
            {vehiculos.map((v) => (
              <MenuItem key={v.id} value={v.id}>
                {v.patente} — {v.marca} {v.modelo}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Recepcionista"
            value={recepcionistaId}
            onChange={(e) => setRecepcionistaId(e.target.value === '' ? '' : Number(e.target.value))}
            fullWidth
            required
            margin="normal"
            error={!!errors.recepcionistaId}
            helperText={errors.recepcionistaId}
          >
            <MenuItem value="">-- Seleccione --</MenuItem>
            {usuarios.map((u) => (
              <MenuItem key={u.id} value={u.id}>
                {u.nombre}
              </MenuItem>
            ))}
          </TextField>

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
