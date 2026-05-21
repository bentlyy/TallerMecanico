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
} from '@mui/material';
import { createPieza, updatePieza } from '../../api/piezaApi';
import { Pieza } from '../../types';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  initialData?: Pieza | null;
}

export default function PiezaForm({ open, onClose, onSave, initialData }: Props) {
  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');
  const [marca, setMarca] = useState('');
  const [precio, setPrecio] = useState<number | ''>('');
  const [stock, setStock] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setCodigo(initialData.codigo || '');
      setNombre(initialData.nombre || '');
      setMarca(initialData.marca || '');
      setPrecio(initialData.precio ?? '');
      setStock(initialData.stock ?? '');
    } else {
      setCodigo('');
      setNombre('');
      setMarca('');
      setPrecio('');
      setStock('');
    }
    setErrors({});
  }, [initialData, open]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!codigo.trim()) errs.codigo = 'El código es requerido';
    if (!nombre.trim()) errs.nombre = 'El nombre es requerido';
    if (precio === '' || Number(precio) < 0) errs.precio = 'Ingrese un precio válido';
    if (stock === '' || Number(stock) < 0) errs.stock = 'Ingrese un stock válido';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      codigo: codigo.trim(),
      nombre: nombre.trim(),
      marca: marca.trim() || null,
      precio: Number(precio),
      stock: Number(stock),
    };

    try {
      setLoading(true);
      if (initialData) {
        await updatePieza(initialData.id, payload);
      } else {
        await createPieza(payload);
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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? 'Editar Pieza' : 'Nueva Pieza'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            label="Código"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            fullWidth
            required
            margin="normal"
            error={!!errors.codigo}
            helperText={errors.codigo}
            autoFocus
          />
          <TextField
            label="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            fullWidth
            required
            margin="normal"
            error={!!errors.nombre}
            helperText={errors.nombre}
          />
          <TextField label="Marca" value={marca} onChange={(e) => setMarca(e.target.value)} fullWidth margin="normal" />
          <TextField
            label="Precio"
            type="number"
            value={precio}
            onChange={(e) => setPrecio(e.target.value === '' ? '' : Number(e.target.value))}
            fullWidth
            required
            margin="normal"
            error={!!errors.precio}
            helperText={errors.precio}
            slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
          />
          <TextField
            label="Stock"
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value === '' ? '' : Number(e.target.value))}
            fullWidth
            required
            margin="normal"
            error={!!errors.stock}
            helperText={errors.stock}
            slotProps={{ htmlInput: { min: 0 } }}
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
