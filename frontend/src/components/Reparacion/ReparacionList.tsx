import { useEffect, useState, useCallback, Fragment } from 'react';
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
  MenuItem,
  Button,
  Collapse,
  Stack,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { getReparaciones, deleteReparacion, cambiarEstado, asignarMecanico } from '../../api/reparacionApi';
import { getMecanicos } from '../../api/mecanicoApi';
import { Reparacion, Mecanico, EstadoReparacion } from '../../types';
import ConfirmDialog from '../common/ConfirmDialog';
import Loading from '../common/Loading';

const estadoColors: Record<EstadoReparacion, 'warning' | 'info' | 'success' | 'default'> = {
  EN_REVISION: 'warning',
  EN_REPARACION: 'info',
  TERMINADO: 'success',
  ENTREGADO: 'default',
};

const estadoLabels: Record<EstadoReparacion, string> = {
  EN_REVISION: 'En Revisión',
  EN_REPARACION: 'En Reparación',
  TERMINADO: 'Terminado',
  ENTREGADO: 'Entregado',
};

interface Props {
  onEdit: (reparacion: Reparacion) => void;
  refreshToggle: boolean;
  onViewDetails: (reparacion: Reparacion) => void;
}

const ReparacionList = ({ onEdit, refreshToggle, onViewDetails }: Props) => {
  const [reparaciones, setReparaciones] = useState<Reparacion[]>([]);
  const [mecanicos, setMecanicos] = useState<Mecanico[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Reparacion | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [assignValues, setAssignValues] = useState<Record<number, number | ''>>({});
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [rRes, mRes] = await Promise.all([getReparaciones(), getMecanicos()]);
      setReparaciones(rRes.data);
      setMecanicos(mRes.data);
    } catch {
      setSnackbar({ open: true, message: 'Error al cargar reparaciones', severity: 'error' });
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
      await deleteReparacion(deleteTarget.id);
      setSnackbar({ open: true, message: 'Reparación eliminada con éxito', severity: 'success' });
      setDeleteTarget(null);
      fetchData();
    } catch {
      setSnackbar({ open: true, message: 'Error al eliminar reparación', severity: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  const handleChangeEstado = async (id: number, nuevo: string) => {
    try {
      await cambiarEstado(id, nuevo);
      setSnackbar({
        open: true,
        message: 'Estado actualizado a ' + estadoLabels[nuevo as EstadoReparacion],
        severity: 'success',
      });
      fetchData();
    } catch {
      setSnackbar({ open: true, message: 'Error al cambiar estado', severity: 'error' });
    }
  };

  const handleAssign = async (id: number) => {
    const mech = assignValues[id];
    if (mech === '' || mech == null) return;
    try {
      await asignarMecanico(id, Number(mech));
      setAssignValues((prev) => ({ ...prev, [id]: '' }));
      setSnackbar({ open: true, message: 'Mecánico asignado con éxito', severity: 'success' });
      fetchData();
    } catch {
      setSnackbar({ open: true, message: 'Error al asignar mecánico', severity: 'error' });
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('es-AR');
    } catch {
      return dateStr;
    }
  };

  if (loading) return <Loading message="Cargando reparaciones..." />;

  return (
    <Box>
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width={40} />
              <TableCell>ID</TableCell>
              <TableCell>Vehículo</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Mecánico</TableCell>
              <TableCell>Fecha Entrada</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reparaciones.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                    No se encontraron reparaciones
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              reparaciones.map((r) => (
                <Fragment key={r.id}>
                  <TableRow hover sx={{ transition: 'background-color 0.2s' }}>
                    <TableCell>
                      <IconButton size="small" onClick={() => setExpandedRow(expandedRow === r.id ? null : r.id)}>
                        {expandedRow === r.id ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        #{r.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {r.vehiculo
                        ? `${r.vehiculo.marca} ${r.vehiculo.modelo} (${r.vehiculo.patente})`
                        : `ID: ${r.vehiculoId}`}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={estadoLabels[r.estado]}
                        color={estadoColors[r.estado]}
                        size="small"
                        variant="filled"
                      />
                    </TableCell>
                    <TableCell>{r.mecanico?.usuario?.nombre || (r.mecanicoId ? `ID: ${r.mecanicoId}` : '—')}</TableCell>
                    <TableCell>{formatDate(r.fechaEntrada)}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} justifyContent="center">
                        <Tooltip title="Ver detalles">
                          <IconButton size="small" color="info" onClick={() => onViewDetails(r)}>
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton size="small" color="primary" onClick={() => onEdit(r)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton size="small" color="error" onClick={() => setDeleteTarget(r)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={7} sx={{ py: 0 }}>
                      <Collapse in={expandedRow === r.id} timeout="auto" unmountOnExit>
                        <Box
                          sx={{
                            py: 2,
                            px: 2,
                            display: 'flex',
                            gap: 2,
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            bgcolor: 'grey.50',
                          }}
                        >
                          <TextField
                            select
                            size="small"
                            label="Cambiar estado"
                            value=""
                            onChange={(e) => handleChangeEstado(r.id, e.target.value)}
                            sx={{ width: 200 }}
                          >
                            <MenuItem value="EN_REVISION">En Revisión</MenuItem>
                            <MenuItem value="EN_REPARACION">En Reparación</MenuItem>
                            <MenuItem value="TERMINADO">Terminado</MenuItem>
                            <MenuItem value="ENTREGADO">Entregado</MenuItem>
                          </TextField>

                          <TextField
                            select
                            size="small"
                            label="Asignar mecánico"
                            value={assignValues[r.id] ?? ''}
                            onChange={(e) => {
                              const val = e.target.value === '' ? '' : Number(e.target.value);
                              setAssignValues((prev) => ({ ...prev, [r.id]: val }));
                            }}
                            sx={{ width: 220 }}
                          >
                            <MenuItem value="">-- Ninguno --</MenuItem>
                            {mecanicos.map((m) => (
                              <MenuItem key={m.id} value={m.id}>
                                {m.usuario?.nombre ?? `Mecánico ${m.id}`}
                              </MenuItem>
                            ))}
                          </TextField>

                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleAssign(r.id)}
                            startIcon={<PlayArrowIcon />}
                          >
                            Asignar
                          </Button>

                          <Button
                            size="small"
                            variant="outlined"
                            color="success"
                            onClick={() => handleChangeEstado(r.id, 'TERMINADO')}
                            startIcon={<DoneAllIcon />}
                          >
                            Marc. terminado
                          </Button>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Eliminar reparación"
        message={`¿Está seguro de eliminar la reparación #${deleteTarget?.id}?`}
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

export default ReparacionList;
