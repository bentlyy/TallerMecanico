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
} from '@mui/material';
import { createVehiculo, updateVehiculo } from '../../api/vehiculoApi';
import { getClientes } from '../../api/clienteApi';
import { Vehiculo, Cliente } from '../../types';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  initialData?: Vehiculo | null;
}

const VehiculoForm = ({ open, onClose, onSave, initialData }: Props) => {
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [anio, setAnio] = useState<number | ''>('');
  const [patente, setPatente] = useState('');
  const [kilometraje, setKilometraje] = useState<number | ''>('');
  const [clienteId, setClienteId] = useState<number | ''>('');
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    getClientes()
      .then((res) => setClientes(res.data))
      .catch(() => setClientes([]));
  }, []);

  useEffect(() => {
    if (initialData) {
      setMarca(initialData.marca || '');
      setModelo(initialData.modelo || '');
      setAnio(initialData.anio ?? '');
      setPatente(initialData.patente || '');
      setKilometraje(initialData.kilometraje ?? '');
      setClienteId(initialData.clienteId || '');
    } else {
      setMarca('');
      setModelo('');
      setAnio('');
      setPatente('');
      setKilometraje('');
      setClienteId('');
    }
    setErrors({});
  }, [initialData, open]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!marca.trim()) errs.marca = 'La marca es requerida';
    if (!modelo.trim()) errs.modelo = 'El modelo es requerido';
    if (!patente.trim()) errs.patente = 'La patente es requerida';
    if (anio !== '' && (Number(anio) < 1900 || Number(anio) > new Date().getFullYear() + 1))
      errs.anio = 'Año fuera de rango';
    if (kilometraje !== '' && Number(kilometraje) < 0) errs.kilometraje = 'Kilometraje no puede ser negativo';
    if (!clienteId) errs.clienteId = 'Debe seleccionar un cliente';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      marca: marca.trim(),
      modelo: modelo.trim(),
      anio: anio === '' ? undefined : Number(anio),
      patente: patente.trim(),
      kilometraje: kilometraje === '' ? undefined : Number(kilometraje),
      clienteId: Number(clienteId),
    };

    try {
      setLoading(true);
      if (initialData) {
        await updateVehiculo(initialData.id, payload);
      } else {
        await createVehiculo(payload);
      }
      onSave();
      onClose();
    } catch {
      // handled by caller
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{initialData ? 'Editar Vehículo' : 'Nuevo Vehículo'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            label="Marca"
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
            fullWidth
            required
            margin="normal"
            error={!!errors.marca}
            helperText={errors.marca}
            autoFocus
          />
          <TextField
            label="Modelo"
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
            fullWidth
            required
            margin="normal"
            error={!!errors.modelo}
            helperText={errors.modelo}
          />
          <TextField
            label="Patente"
            value={patente}
            onChange={(e) => setPatente(e.target.value)}
            fullWidth
            required
            margin="normal"
            error={!!errors.patente}
            helperText={errors.patente}
          />
          <TextField
            label="Año"
            type="number"
            value={anio}
            onChange={(e) => setAnio(e.target.value === '' ? '' : Number(e.target.value))}
            fullWidth
            margin="normal"
            error={!!errors.anio}
            helperText={errors.anio}
            slotProps={{ htmlInput: { min: 1900, max: new Date().getFullYear() + 1 } }}
          />
          <TextField
            label="Kilometraje"
            type="number"
            value={kilometraje}
            onChange={(e) => setKilometraje(e.target.value === '' ? '' : Number(e.target.value))}
            fullWidth
            margin="normal"
            error={!!errors.kilometraje}
            helperText={errors.kilometraje}
            slotProps={{ htmlInput: { min: 0 } }}
          />
          <TextField
            select
            label="Cliente"
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value === '' ? '' : Number(e.target.value))}
            fullWidth
            required
            margin="normal"
            error={!!errors.clienteId}
            helperText={errors.clienteId}
          >
            <MenuItem value="">-- Seleccione --</MenuItem>
            {clientes.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.nombre}
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

export default VehiculoForm;
