import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import type { Reparacion } from '../../types';
import { estadoColors, estadoLabels } from './estadoReparacion';

interface Props {
  reparaciones: Reparacion[];
}

const LIMITE = 6;

const formatFecha = (v: string) => {
  try {
    return new Date(v).toLocaleDateString('es-AR');
  } catch {
    return v;
  }
};

const textoServicio = (r: Reparacion) => {
  const nombreServicio = r.servicios?.[0]?.servicio?.nombre;
  if (nombreServicio) return nombreServicio;
  if (r.descripcion) return r.descripcion;
  if (r.problemaReportado) return r.problemaReportado;
  return '—';
};

export default function RecentRepairs({ reparaciones }: Props) {
  const navigate = useNavigate();
  const recientes = useMemo(
    () =>
      [...reparaciones]
        .sort((a, b) => new Date(b.fechaEntrada).getTime() - new Date(a.fechaEntrada).getTime())
        .slice(0, LIMITE),
    [reparaciones],
  );

  return (
    <Card variant="outlined" sx={{ boxShadow: 'none', borderRadius: 2 }}>
      <CardContent sx={{ '&:last-child': { pb: 2 } }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1,
            mb: 1.5,
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Trabajos recientes
          </Typography>
          <Button
            size="small"
            onClick={() => navigate('/reparaciones')}
            endIcon={<ArrowForwardIcon />}
            sx={{ textTransform: 'none' }}
          >
            Ver todos
          </Button>
        </Box>
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table size="small" sx={{ minWidth: 640 }}>
            <TableHead>
              <TableRow>
                <TableCell>Patente</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Servicio</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recientes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <DirectionsCarIcon sx={{ fontSize: 36, color: 'text.disabled', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      No hay trabajos recientes todavía
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                recientes.map((r) => (
                  <TableRow key={r.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={{ maxWidth: 140 }}>
                      <Tooltip
                        title={
                          r.vehiculo
                            ? `${r.vehiculo.marca} ${r.vehiculo.modelo} ${r.vehiculo.anio ?? ''}`.trim()
                            : `Vehículo #${r.vehiculoId}`
                        }
                        arrow
                      >
                        <Typography variant="body2" fontWeight={600} noWrap>
                          {r.vehiculo ? r.vehiculo.patente : `#${r.id}`}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 160 }}>
                      <Tooltip title={r.vehiculo?.cliente?.nombre ?? ''} arrow>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {r.vehiculo?.cliente?.nombre ?? '—'}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 220 }}>
                      <Tooltip title={textoServicio(r)} arrow>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {textoServicio(r)}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Chip label={estadoLabels[r.estado]} color={estadoColors[r.estado]} size="small" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {formatFecha(r.fechaEntrada)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Abrir en reparaciones">
                        <IconButton size="small" color="primary" onClick={() => navigate('/reparaciones')}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
