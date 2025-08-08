import React, { useEffect, useState } from 'react';
import {
  Box, TextField, Button, MenuItem, Typography, Stack
} from '@mui/material';
import {
  createReparacion,
  updateReparacion,
  getReparacionById,
} from '../../api/reparacionApi';
import { getAllVehiculos } from '../../api/vehiculoApi';
import { getAllMecanicos } from '../../api/mecanicoApi';
import { getAllUsuarios } from '../../api/usuarioApi';
import { Reparacion } from '../../types';

interface Props {
  reparacionId?: number | null;
  onSuccess: () => void;
  onCancel?: () => void;
}

const ReparacionForm: React.FC<Props> = ({ reparacionId, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [descripcion, setDescripcion] = useState('');
  const [costoManoObra, setCostoManoObra] = useState<number>(0);
  const [vehiculoId, setVehiculoId] = useState<number | null>(null);
  const [mecanicoId, setMecanicoId] = useState<number | null>(null);
  const [recepcionistaId, setRecepcionistaId] = useState<number | null>(null);

  const [vehiculos, setVehiculos] = useState<any[]>([]);
  const [mecanicos, setMecanicos] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);

  useEffect(() => {
    getAllVehiculos().then(res => setVehiculos(res.data)).catch(() => setVehiculos([]));
    getAllMecanicos().then(res => setMecanicos(res.data)).catch(() => setMecanicos([]));
    getAllUsuarios().then(res => setUsuarios(res.data)).catch(() => setUsuarios([]));
  }, []);

  useEffect(() => {
    if (reparacionId) {
      setLoading(true);
      getReparacionById(reparacionId)
        .then(res => {
          const r: Reparacion = res.data;
          setDescripcion(r.descripcion ?? '');
          setCostoManoObra(r.costoManoObra ?? 0);
          setVehiculoId(r.vehiculoId ?? null);
          setMecanicoId(r.mecanicoId ?? null);
          setRecepcionistaId(r.recepcionistaId ?? null);
        })
        .catch((e) => console.error(e))
        .finally(() => setLoading(false));
    } else {
      setDescripcion('');
      setCostoManoObra(0);
      setVehiculoId(null);
      setMecanicoId(null);
      setRecepcionistaId(null);
    }
  }, [reparacionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!descripcion || !vehiculoId || !recepcionistaId) {
      alert('Descripción, vehículo y recepcionista son obligatorios.');
      return;
    }

    setLoading(true);
    const payload = {
      descripcion,
      costoManoObra,
      vehiculoId,
      mecanicoId,
      recepcionistaId,
    };

    try {
      if (reparacionId) {
        await updateReparacion(reparacionId, payload);
      } else {
        await createReparacion(payload);
      }
      onSuccess();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.error || err.message || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
      <Typography variant="h6" mb={2}>{reparacionId ? 'Editar Reparación' : 'Nueva Reparación'}</Typography>

      <TextField
        label="Descripción"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        fullWidth
        required
        margin="normal"
        disabled={loading}
      />

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Vehículo"
          select
          value={vehiculoId ?? ''}
          onChange={(e) => setVehiculoId(e.target.value === '' ? null : Number(e.target.value))}
          fullWidth
          required
          margin="normal"
          disabled={loading}
        >
          <MenuItem value="">-- Seleccione --</MenuItem>
          {vehiculos.map((v: any) => (
            <MenuItem key={v.id} value={v.id}>
              {v.patente ?? `${v.marca ?? ''} ${v.modelo ?? ''}`}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Recepcionista"
          select
          value={recepcionistaId ?? ''}
          onChange={(e) => setRecepcionistaId(e.target.value === '' ? null : Number(e.target.value))}
          fullWidth
          required
          margin="normal"
          disabled={loading}
        >
          <MenuItem value="">-- Seleccione --</MenuItem>
          {usuarios.map((u: any) => (
            <MenuItem key={u.id} value={u.id}>{u.nombre}</MenuItem>
          ))}
        </TextField>
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Mecánico (opcional)"
          select
          value={mecanicoId ?? ''}
          onChange={(e) => setMecanicoId(e.target.value === '' ? null : Number(e.target.value))}
          fullWidth
          margin="normal"
          disabled={loading}
        >
          <MenuItem value="">-- Ninguno --</MenuItem>
          {mecanicos.map((m: any) => (
            <MenuItem key={m.id} value={m.id}>
              {m.usuario?.nombre ?? `Mecánico ${m.id}`}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Costo Mano de Obra"
          type="number"
          value={costoManoObra}
          onChange={(e) => setCostoManoObra(Number(e.target.value ?? 0))}
          fullWidth
          margin="normal"
          inputProps={{ min: 0, step: 0.01 }}
          disabled={loading}
        />
      </Stack>

      <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        {onCancel && <Button onClick={onCancel} disabled={loading}>Cancelar</Button>}
        <Button type="submit" variant="contained" disabled={loading}>
          {reparacionId ? 'Actualizar' : 'Crear'}
        </Button>
      </Box>
    </Box>
  );
};

export default ReparacionForm;
