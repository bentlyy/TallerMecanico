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
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { getUsuarios, deleteUsuario, activateUsuario, deactivateUsuario } from '../../api/usuarioApi';
import { getRoles } from '../../api/rolApi';
import { Usuario, Rol } from '../../types';
import ConfirmDialog from '../common/ConfirmDialog';
import Loading from '../common/Loading';

interface Props {
  onEdit: (usuario: Usuario) => void;
  refreshToggle: boolean;
}

export default function UsuarioList({ onEdit, refreshToggle }: Props) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [rolesMap, setRolesMap] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Usuario | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchUsuarios = useCallback(async () => {
    try {
      setLoading(true);
      const [uRes, rRes] = await Promise.all([getUsuarios(), getRoles()]);
      setUsuarios(uRes.data);
      const map: Record<number, string> = {};
      rRes.data.forEach((rol: Rol) => {
        map[rol.id] = rol.nombre;
      });
      setRolesMap(map);
    } catch {
      setSnackbar({ open: true, message: 'Error al cargar usuarios', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios, refreshToggle]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await deleteUsuario(deleteTarget.id);
      setSnackbar({ open: true, message: 'Usuario eliminado con éxito', severity: 'success' });
      setDeleteTarget(null);
      fetchUsuarios();
    } catch {
      setSnackbar({ open: true, message: 'Error al eliminar usuario', severity: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleActive = async (usuario: Usuario) => {
    try {
      if (usuario.activo) {
        await deactivateUsuario(usuario.id);
        setSnackbar({ open: true, message: 'Usuario desactivado', severity: 'success' });
      } else {
        await activateUsuario(usuario.id);
        setSnackbar({ open: true, message: 'Usuario activado', severity: 'success' });
      }
      fetchUsuarios();
    } catch {
      setSnackbar({ open: true, message: 'Error al cambiar estado del usuario', severity: 'error' });
    }
  };

  if (loading) return <Loading message="Cargando usuarios..." />;

  return (
    <Box>
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Activo</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                    No se encontraron usuarios
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              usuarios.map((u) => (
                <TableRow key={u.id} hover>
                  <TableCell>{u.nombre}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.rolNombre || rolesMap[u.rolId] || '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={u.activo ? 'Activo' : 'Inactivo'}
                      color={u.activo ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" color="primary" onClick={() => onEdit(u)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color={u.activo ? 'warning' : 'success'}
                      onClick={() => handleToggleActive(u)}
                    >
                      {u.activo ? <BlockIcon /> : <CheckCircleIcon />}
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => setDeleteTarget(u)}>
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
        title="Eliminar usuario"
        message={`¿Está seguro de eliminar al usuario "${deleteTarget?.nombre}"?`}
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
