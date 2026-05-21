import { useState, useEffect, useCallback } from 'react';
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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getRoles, deleteRol } from '../../api/rolApi';
import { Rol } from '../../types';
import ConfirmDialog from '../common/ConfirmDialog';
import Loading from '../common/Loading';

interface Props {
  onEdit: (rol: Rol) => void;
  refreshToggle: boolean;
}

export default function RolList({ onEdit, refreshToggle }: Props) {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Rol | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getRoles();
      setRoles(res.data);
    } catch {
      setSnackbar({ open: true, message: 'Error al cargar roles', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles, refreshToggle]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await deleteRol(deleteTarget.id);
      setSnackbar({ open: true, message: 'Rol eliminado con éxito', severity: 'success' });
      setDeleteTarget(null);
      fetchRoles();
    } catch {
      setSnackbar({ open: true, message: 'Error al eliminar rol', severity: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Loading message="Cargando roles..." />;

  return (
    <Box>
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Permisos</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                    No se encontraron roles
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              roles.map((rol) => (
                <TableRow key={rol.id} hover>
                  <TableCell>{rol.nombre}</TableCell>
                  <TableCell>
                    <pre style={{ margin: 0, maxHeight: 100, overflow: 'auto', fontSize: '0.8rem' }}>
                      {JSON.stringify(rol.permisos, null, 2)}
                    </pre>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" color="primary" onClick={() => onEdit(rol)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => setDeleteTarget(rol)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Eliminar rol"
        message={`¿Está seguro de eliminar el rol "${deleteTarget?.nombre}"?`}
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
