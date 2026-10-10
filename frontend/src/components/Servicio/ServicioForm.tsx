import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { createServicio, updateServicio } from '../../api/servicioApi';
import { getErrorMessage } from '../../api/errorMessage';
import { Servicio } from '../../types';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  initialData?: Servicio | null;
}

export default function ServicioForm({ open, onClose, onSave, initialData }: Props) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [problemaReportado, setProblemaReportado] = useState('');
  const [diagnostico, setDiagnostico] = useState('');
  const [trabajosRealizados, setTrabajosRealizados] = useState('');
  const [precioBase, setPrecioBase] = useState<number | ''>('');
  const [activo, setActivo] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setErrorMsg('');
    if (initialData) {
      setNombre(initialData.nombre || '');
      setDescripcion(initialData.descripcion || '');
      setProblemaReportado(initialData.problemaReportado || '');
      setDiagnostico(initialData.diagnostico || '');
      setTrabajosRealizados(initialData.trabajosRealizados || '');
      setPrecioBase(initialData.precioBase ?? '');
      setActivo(initialData.activo ?? true);
    } else {
      setNombre('');
      setDescripcion('');
      setProblemaReportado('');
      setDiagnostico('');
      setTrabajosRealizados('');
      setPrecioBase('');
      setActivo(true);
    }
    setErrors({});
  }, [initialData, open]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!nombre.trim()) errs.nombre = 'El nombre es requerido';
    if (precioBase === '' || Number(precioBase) < 0) errs.precioBase = 'Ingrese un precio válido';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      nombre: nombre.trim(),
      descripcion: descripcion.trim() || null,
      problemaReportado: problemaReportado.trim() || null,
      diagnostico: diagnostico.trim() || null,
      trabajosRealizados: trabajosRealizados.trim() || null,
      precioBase: Number(precioBase),
      activo,
    };

    try {
      setLoading(true);
      setErrorMsg('');
      if (initialData) {
        await updateServicio(initialData.id, payload);
      } else {
        await createServicio(payload);
      }
      onSave();
      onClose();
    } catch (err) {
      setErrorMsg(getErrorMessage(err, 'Error al guardar el servicio'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? 'Editar Servicio' : 'Nuevo Servicio'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          {errorMsg && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMsg('')}>
              {errorMsg}
            </Alert>
          )}
          <TextField
            label="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            fullWidth
            required
            margin="normal"
            error={!!errors.nombre}
            helperText={errors.nombre}
            autoFocus
          />
          <TextField
            label="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            fullWidth
            margin="normal"
            helperText="Se usa como resumen al agregar el servicio a una reparación."
          />
          <TextField
            label="Precio base"
            type="number"
            value={precioBase}
            onChange={(e) => setPrecioBase(e.target.value === '' ? '' : Number(e.target.value))}
            fullWidth
            required
            margin="normal"
            error={!!errors.precioBase}
            helperText={errors.precioBase}
            slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
          />
          <TextField
            label="Problema reportado por defecto"
            value={problemaReportado}
            onChange={(e) => setProblemaReportado(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={2}
          />
          <TextField
            label="Diagnóstico por defecto"
            value={diagnostico}
            onChange={(e) => setDiagnostico(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={2}
          />
          <TextField
            label="Trabajos realizados por defecto"
            value={trabajosRealizados}
            onChange={(e) => setTrabajosRealizados(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={2}
          />
          <FormControlLabel
            control={<Switch checked={activo} onChange={(e) => setActivo(e.target.checked)} />}
            label="Activo (disponible para nuevas reparaciones)"
            sx={{ mt: 1 }}
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
}
