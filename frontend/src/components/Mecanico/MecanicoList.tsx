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
import { getMecanicos, deleteMecanico } from '../../api/mecanicoApi';
import { Mecanico } from '../../types';
import ConfirmDialog from '../common/ConfirmDialog';
import Loading from '../common/Loading';

interface Props {
  onEdit: (mecanico: Mecanico) => void;
  refreshToggle: boolean;
}

export default function MecanicoList({ onEdit, refreshToggle }: Props) {
  const [mecanicos, setMecanicos] = useState<Mecanico[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Mecanico | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchMecanicos = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getMecanicos();
      setMecanicos(res.data);
    } catch {
      setSnackbar({ open: true, message: 'Error al cargar mecánicos', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMecanicos();
  }, [fetchMecanicos, refreshToggle]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await deleteMecanico(deleteTarget.id);
      setSnackbar({ open: true, message: 'Mecánico eliminado con éxito', severity: 'success' });
      setDeleteTarget(null);
      fetchMecanicos();
    } catch {
      setSnackbar({ open: true, message: 'Error al eliminar mecánico', severity: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Loading message="Cargando mecánicos..." />;

  return (
    <Box>
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Especialidad</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mecanicos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                    No se encontraron mecánicos
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              mecanicos.map((m) => (
                <TableRow key={m.id} hover>
                  <TableCell>{m.id}</TableCell>
                  <TableCell>{m.usuario?.nombre || '-'}</TableCell>
                  <TableCell>{m.usuario?.email || '-'}</TableCell>
                  <TableCell>{m.especialidad || '-'}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" color="primary" onClick={() => onEdit(m)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => setDeleteTarget(m)}>
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
        title="Eliminar mecánico"
        message={`¿Está seguro de eliminar a "${deleteTarget?.usuario?.nombre || 'este mecánico'}"?`}
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
