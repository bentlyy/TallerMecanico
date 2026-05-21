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
  Snackbar,
  Alert,
  Tooltip,
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getVehiculos, deleteVehiculo } from '../../api/vehiculoApi';
import { getClientes } from '../../api/clienteApi';
import { Vehiculo, Cliente } from '../../types';
import ConfirmDialog from '../common/ConfirmDialog';
import Loading from '../common/Loading';

interface Props {
  onEdit: (vehiculo: Vehiculo) => void;
  refreshToggle: boolean;
}

const VehiculoList = ({ onEdit, refreshToggle }: Props) => {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Vehiculo | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [vRes, cRes] = await Promise.all([getVehiculos(), getClientes()]);
      setVehiculos(vRes.data);
      setClientes(cRes.data);
    } catch {
      setSnackbar({ open: true, message: 'Error al cargar vehículos', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshToggle]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await deleteVehiculo(deleteTarget.id);
      setSnackbar({ open: true, message: 'Vehículo eliminado con éxito', severity: 'success' });
      setDeleteTarget(null);
      fetchData();
    } catch {
      setSnackbar({ open: true, message: 'Error al eliminar vehículo', severity: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  const clienteMap = new Map(clientes.map((c) => [c.id, c.nombre]));

  if (loading) return <Loading message="Cargando vehículos..." />;

  return (
    <Box>
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patente</TableCell>
              <TableCell>Marca</TableCell>
              <TableCell>Modelo</TableCell>
              <TableCell>Año</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vehiculos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                    No se encontraron vehículos
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              vehiculos.map((vehiculo) => (
                <TableRow key={vehiculo.id} hover sx={{ transition: 'background-color 0.2s' }}>
                  <TableCell>
                    <Chip label={vehiculo.patente} size="small" variant="outlined" color="primary" />
                  </TableCell>
                  <TableCell>{vehiculo.marca}</TableCell>
                  <TableCell>{vehiculo.modelo}</TableCell>
                  <TableCell>{vehiculo.anio || '-'}</TableCell>
                  <TableCell>{clienteMap.get(vehiculo.clienteId) || '—'}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Editar">
                      <IconButton size="small" color="primary" onClick={() => onEdit(vehiculo)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton size="small" color="error" onClick={() => setDeleteTarget(vehiculo)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Eliminar vehículo"
        message={`¿Está seguro de eliminar el vehículo "${deleteTarget?.patente}"?`}
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
};

export default VehiculoList;
