import { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Tooltip,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getVehiculosByCliente, deleteVehiculo } from '../../api/vehiculoApi';
import { getErrorMessage } from '../../api/errorMessage';
import { Vehiculo, Cliente } from '../../types';
import VehiculoForm from '../Vehiculo/VehiculoForm';
import ConfirmDialog from '../common/ConfirmDialog';

interface Props {
  cliente: Cliente;
}

const ClienteVehiculos = ({ cliente }: Props) => {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Vehiculo | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Vehiculo | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchVehiculos = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getVehiculosByCliente(cliente.id);
      setVehiculos(res.data);
    } catch (err) {
      setSnackbar({ open: true, message: getErrorMessage(err, 'Error al cargar vehículos'), severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [cliente.id]);

  useEffect(() => {
    fetchVehiculos();
  }, [fetchVehiculos]);

  const handleCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleEdit = (vehiculo: Vehiculo) => {
    setEditing(vehiculo);
    setFormOpen(true);
  };

  const handleSave = () => {
    setSnackbar({
      open: true,
      message: editing ? 'Vehículo actualizado con éxito' : 'Vehículo creado con éxito',
      severity: 'success',
    });
    fetchVehiculos();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await deleteVehiculo(deleteTarget.id);
      setSnackbar({ open: true, message: 'Vehículo eliminado con éxito', severity: 'success' });
      setDeleteTarget(null);
      fetchVehiculos();
    } catch (err) {
      setSnackbar({ open: true, message: getErrorMessage(err, 'Error al eliminar vehículo'), severity: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box sx={{ bgcolor: 'action.hover', borderRadius: 2, p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
        <Typography variant="subtitle2" fontWeight={600}>
          Vehículos de {cliente.nombre}
        </Typography>
        <Button size="small" variant="outlined" startIcon={<AddIcon />} onClick={handleCreate}>
          Agregar Vehículo
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <CircularProgress size={24} />
        </Box>
      ) : vehiculos.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
          Este cliente no tiene vehículos registrados.
        </Typography>
      ) : (
        <Table size="small" sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
          <TableHead>
            <TableRow>
              <TableCell>Patente</TableCell>
              <TableCell>Marca</TableCell>
              <TableCell>Modelo</TableCell>
              <TableCell>Año</TableCell>
              <TableCell>Kilometraje</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vehiculos.map((v) => (
              <TableRow key={v.id} hover>
                <TableCell>
                  <Chip label={v.patente} size="small" variant="outlined" color="primary" />
                </TableCell>
                <TableCell>{v.marca}</TableCell>
                <TableCell>{v.modelo}</TableCell>
                <TableCell>{v.anio || '-'}</TableCell>
                <TableCell>{v.kilometraje != null ? `${v.kilometraje.toLocaleString()} km` : '-'}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Editar">
                    <IconButton size="small" color="primary" onClick={() => handleEdit(v)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton size="small" color="error" onClick={() => setDeleteTarget(v)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <VehiculoForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        initialData={editing}
        defaultClienteId={cliente.id}
        lockCliente
      />

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

export default ClienteVehiculos;
