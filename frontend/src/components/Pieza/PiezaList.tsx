import { useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
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
  TextField,
  InputAdornment,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import BlockIcon from '@mui/icons-material/Block';
import PaymentsIcon from '@mui/icons-material/Payments';
import { getPiezas, deletePieza } from '../../api/piezaApi';
import { getErrorMessage } from '../../api/errorMessage';
import { Pieza } from '../../types';
import ConfirmDialog from '../common/ConfirmDialog';
import Loading from '../common/Loading';

interface Props {
  onEdit: (pieza: Pieza) => void;
  refreshToggle: boolean;
}

type FilterKey = 'todos' | 'bajo' | 'sin';

const fmtCLP = (n: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n);

const StatCard = ({ icon, label, value, color }: { icon: ReactNode; label: string; value: string; color: string }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      borderRadius: 2,
      border: '1px solid',
      borderColor: 'divider',
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      flex: 1,
      minWidth: 180,
    }}
  >
    <Box
      sx={{
        width: 48,
        height: 48,
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: alpha(color, 0.12),
        color,
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.1 }}>
        {value}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
    </Box>
  </Paper>
);

export default function PiezaList({ onEdit, refreshToggle }: Props) {
  const [piezas, setPiezas] = useState<Pieza[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterKey>('todos');
  const [deleteTarget, setDeleteTarget] = useState<Pieza | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchPiezas = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getPiezas();
      setPiezas(res.data);
    } catch (err) {
      setSnackbar({ open: true, message: getErrorMessage(err, 'Error al cargar piezas'), severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPiezas();
  }, [fetchPiezas, refreshToggle]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await deletePieza(deleteTarget.id);
      setSnackbar({ open: true, message: 'Pieza eliminada con éxito', severity: 'success' });
      setDeleteTarget(null);
      fetchPiezas();
    } catch (err) {
      setSnackbar({ open: true, message: getErrorMessage(err, 'Error al eliminar pieza'), severity: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  const stats = useMemo(() => {
    const valor = piezas.reduce((acc, p) => acc + Number(p.precio) * Number(p.stock), 0);
    const bajo = piezas.filter((p) => p.stock > 0 && p.stock <= 5).length;
    const sin = piezas.filter((p) => p.stock <= 0).length;
    return { total: piezas.length, valor, bajo, sin };
  }, [piezas]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return piezas.filter((p) => {
      const matchesSearch = !q || `${p.codigo} ${p.nombre} ${p.marca ?? ''}`.toLowerCase().includes(q);
      const matchesFilter =
        filter === 'todos' || (filter === 'bajo' && p.stock > 0 && p.stock <= 5) || (filter === 'sin' && p.stock <= 0);
      return matchesSearch && matchesFilter;
    });
  }, [piezas, search, filter]);

  if (loading) return <Loading message="Cargando inventario..." />;

  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2, flexWrap: 'wrap' }}>
        <StatCard icon={<Inventory2Icon />} label="Piezas registradas" value={String(stats.total)} color="#0d47a1" />
        <StatCard icon={<PaymentsIcon />} label="Valor del inventario" value={fmtCLP(stats.valor)} color="#2e7d32" />
        <StatCard icon={<WarningAmberIcon />} label="Stock bajo (≤ 5)" value={String(stats.bajo)} color="#ed6c02" />
        <StatCard icon={<BlockIcon />} label="Sin stock" value={String(stats.sin)} color="#d32f2f" />
      </Stack>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'space-between', mb: 2 }}>
        <TextField
          size="small"
          placeholder="Buscar por código, nombre o marca..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: { xs: '100%', sm: 340 } }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            },
          }}
        />
        <ToggleButtonGroup
          size="small"
          exclusive
          value={filter}
          onChange={(_e, val) => val && setFilter(val)}
          sx={{ flexWrap: 'wrap' }}
        >
          <ToggleButton value="todos">Todos</ToggleButton>
          <ToggleButton value="bajo">Stock bajo</ToggleButton>
          <ToggleButton value="sin">Sin stock</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{
                '& th': {
                  bgcolor: alpha('#0d47a1', 0.06),
                  fontWeight: 700,
                  color: 'text.primary',
                  borderBottom: '2px solid',
                  borderColor: 'divider',
                },
              }}
            >
              <TableCell>Código</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Marca</TableCell>
              <TableCell align="right">Precio</TableCell>
              <TableCell align="center">Stock</TableCell>
              <TableCell align="right">Valor</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Box sx={{ py: 5 }}>
                    <Inventory2Icon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {piezas.length === 0
                        ? 'Aún no hay piezas en el inventario'
                        : 'No se encontraron piezas con ese criterio'}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((pieza) => {
                const low = pieza.stock > 0 && pieza.stock <= 5;
                const out = pieza.stock <= 0;
                return (
                  <TableRow
                    key={pieza.id}
                    hover
                    sx={{
                      bgcolor: out ? alpha('#d32f2f', 0.05) : low ? alpha('#ed6c02', 0.07) : undefined,
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                        {pieza.codigo}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{pieza.nombre}</TableCell>
                    <TableCell>{pieza.marca || '-'}</TableCell>
                    <TableCell align="right">{fmtCLP(Number(pieza.precio))}</TableCell>
                    <TableCell align="center">
                      <Chip
                        size="small"
                        label={out ? 'Sin stock' : pieza.stock}
                        color={out ? 'error' : low ? 'warning' : 'success'}
                        icon={out ? <BlockIcon /> : low ? <WarningAmberIcon /> : undefined}
                      />
                    </TableCell>
                    <TableCell align="right">{fmtCLP(Number(pieza.precio) * Number(pieza.stock))}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Editar">
                        <IconButton size="small" color="primary" onClick={() => onEdit(pieza)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton size="small" color="error" onClick={() => setDeleteTarget(pieza)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5, textAlign: 'right' }}>
        Mostrando {filtered.length} de {piezas.length} piezas
      </Typography>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Eliminar pieza"
        message={`¿Está seguro de eliminar la pieza "${deleteTarget?.nombre}"?`}
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
