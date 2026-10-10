import { useEffect, useState, useCallback } from 'react';
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
  Stack,
  MenuItem,
  Switch,
  FormControlLabel,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getUbicaciones, createUbicacion, updateUbicacion, deleteUbicacion } from '../api/ubicacionApi';
import { getErrorMessage } from '../api/errorMessage';
import { Ubicacion, TipoUbicacion } from '../types';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Loading from '../components/common/Loading';

const TIPO_OPCIONES: { value: TipoUbicacion; label: string }[] = [
  { value: 'RECEPCION', label: 'Recepción' },
  { value: 'ESTACIONAMIENTO', label: 'Estacionamiento' },
  { value: 'BAHIA', label: 'Bahía' },
  { value: 'ELEVADOR', label: 'Elevador' },
  { value: 'FOSO', label: 'Foso' },
  { value: 'DIAGNOSTICO', label: 'Diagnóstico' },
  { value: 'ALINEACION', label: 'Alineación y balanceo' },
  { value: 'NEUMATICOS', label: 'Neumáticos' },
  { value: 'LUBRICACION', label: 'Lubricación' },
  { value: 'ELECTRICIDAD', label: 'Electricidad' },
  { value: 'CHAPA_PINTURA', label: 'Chapa y pintura' },
  { value: 'LAVADO', label: 'Lavado' },
  { value: 'TERMINADOS', label: 'Listos para entrega' },
  { value: 'OTRO', label: 'Otro' },
];

export default function UbicacionesPage() {
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Ubicacion | null>(null);
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState<TipoUbicacion>('OTRO');
  const [orden, setOrden] = useState<number>(0);
  const [activo, setActivo] = useState(true);
  const [includeInactive, setIncludeInactive] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Ubicacion | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getUbicaciones(includeInactive);
      setUbicaciones(res.data);
    } catch (err) {
      setSnackbar({ open: true, message: getErrorMessage(err, 'Error al cargar ubicaciones'), severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [includeInactive]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const resetForm = () => {
    setEditing(null);
    setNombre('');
    setTipo('OTRO');
    setOrden(0);
    setActivo(true);
  };

  const handleEdit = (u: Ubicacion) => {
    setEditing(u);
    setNombre(u.nombre);
    setTipo(u.tipo);
    setOrden(u.orden);
    setActivo(u.activo);
  };

  const handleSave = async () => {
    if (!nombre.trim()) return;
    try {
      setSaving(true);
      const payload = {
        nombre: nombre.trim(),
        tipo,
        orden: Number(orden) || 0,
        activo,
      };
      if (editing) {
        await updateUbicacion(editing.id, payload);
        setSnackbar({ open: true, message: 'Ubicación actualizada', severity: 'success' });
      } else {
        await createUbicacion(payload);
        setSnackbar({ open: true, message: 'Ubicación creada', severity: 'success' });
      }
      resetForm();
      fetchData();
    } catch (err) {
      setSnackbar({ open: true, message: getErrorMessage(err, 'Error al guardar ubicación'), severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await deleteUbicacion(deleteTarget.id);
      setSnackbar({ open: true, message: 'Ubicación eliminada', severity: 'success' });
      setDeleteTarget(null);
      fetchData();
    } catch (err) {
      setSnackbar({ open: true, message: getErrorMessage(err, 'Error al eliminar ubicación'), severity: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Loading message="Cargando ubicaciones..." />;

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Ubicaciones (Premium)
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="flex-end" flexWrap="wrap">
          <TextField
            label="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            size="small"
            sx={{ minWidth: 220 }}
          />
          <TextField
            select
            label="Tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value as TipoUbicacion)}
            size="small"
            sx={{ minWidth: 220 }}
          >
            {TIPO_OPCIONES.map((o) => (
              <MenuItem key={o.value} value={o.value}>
                {o.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Orden"
            type="number"
            value={orden}
            onChange={(e) => setOrden(Number(e.target.value) || 0)}
            size="small"
            sx={{ width: 100 }}
          />
          <FormControlLabel
            control={<Switch checked={activo} onChange={(e) => setActivo(e.target.checked)} />}
            label="Activa"
          />
          <FormControlLabel
            control={<Switch checked={includeInactive} onChange={(e) => setIncludeInactive(e.target.checked)} />}
            label="Incluir inactivas"
          />
          <Stack direction="row" spacing={1}>
            <button onClick={handleSave} disabled={saving || !nombre.trim()}>
              {editing ? 'Actualizar' : 'Crear'}
            </button>
            {editing && (
              <button onClick={resetForm} disabled={saving}>
                Cancelar
              </button>
            )}
          </Stack>
        </Stack>
      </Paper>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell align="center">Orden</TableCell>
              <TableCell align="center">Estado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ubicaciones.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                    Sin ubicaciones
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              ubicaciones.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.nombre}</TableCell>
                  <TableCell>{TIPO_OPCIONES.find((t) => t.value === u.tipo)?.label || u.tipo}</TableCell>
                  <TableCell align="center">{u.orden}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={u.activo ? 'Activa' : 'Inactiva'}
                      color={u.activo ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={0.5} justifyContent="center">
                      <Tooltip title="Editar">
                        <IconButton size="small" color="primary" onClick={() => handleEdit(u)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton size="small" color="error" onClick={() => setDeleteTarget(u)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Eliminar ubicación"
        message={`Se eliminará "${deleteTarget?.nombre}". No se permite si hay reparaciones ocupando esta ubicación.`}
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
}
