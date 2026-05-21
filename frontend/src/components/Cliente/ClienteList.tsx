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
  TextField,
  Box,
  Typography,
  Snackbar,
  Alert,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { getClientes, deleteCliente } from '../../api/clienteApi';
import { Cliente } from '../../types';
import ConfirmDialog from '../common/ConfirmDialog';
import Loading from '../common/Loading';

interface Props {
  onEdit: (cliente: Cliente) => void;
  refreshToggle: boolean;
}

export const ClienteList = ({ onEdit, refreshToggle }: Props) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Cliente | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchClientes = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getClientes();
      setClientes(res.data);
    } catch {
      setSnackbar({ open: true, message: 'Error al cargar clientes', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes, refreshToggle]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await deleteCliente(deleteTarget.id);
      setSnackbar({ open: true, message: 'Cliente eliminado con éxito', severity: 'success' });
      setDeleteTarget(null);
      fetchClientes();
    } catch {
      setSnackbar({ open: true, message: 'Error al eliminar cliente', severity: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  const filtered = clientes.filter((c) => c.nombre.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <Loading message="Cargando clientes..." />;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          Clientes
        </Typography>
        <TextField
          size="small"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} fontSize="small" />,
            },
          }}
          sx={{ width: 280 }}
        />
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Dirección</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                    No se encontraron clientes
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((cliente) => (
                <TableRow key={cliente.id} hover sx={{ transition: 'background-color 0.2s' }}>
                  <TableCell>{cliente.nombre}</TableCell>
                  <TableCell>{cliente.email || '-'}</TableCell>
                  <TableCell>{cliente.telefono || '-'}</TableCell>
                  <TableCell>{cliente.direccion || '-'}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Editar">
                      <IconButton size="small" color="primary" onClick={() => onEdit(cliente)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton size="small" color="error" onClick={() => setDeleteTarget(cliente)}>
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
        title="Eliminar cliente"
        message={`¿Está seguro de eliminar a "${deleteTarget?.nombre}"? Esta acción no se puede deshacer.`}
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
