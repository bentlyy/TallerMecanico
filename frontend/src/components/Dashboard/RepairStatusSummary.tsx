import type { ReactNode } from 'react';
import { Box, Card, CardContent, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import HandymanIcon from '@mui/icons-material/Handyman';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import type { EstadoReparacion, Reparacion } from '../../types';

interface Props {
  reparaciones: Reparacion[];
}

const ESTADOS: { estado: EstadoReparacion; label: string; icon: ReactNode }[] = [
  { estado: 'EN_REVISION', label: 'En revisión', icon: <BuildIcon fontSize="small" /> },
  { estado: 'EN_REPARACION', label: 'En reparación', icon: <HandymanIcon fontSize="small" /> },
  { estado: 'TERMINADO', label: 'Terminados', icon: <CheckCircleOutlineIcon fontSize="small" /> },
];

export default function RepairStatusSummary({ reparaciones }: Props) {
  const theme = useTheme();
  const colores: Record<string, string> = {
    EN_REVISION: theme.palette.warning.main,
    EN_REPARACION: theme.palette.info.main,
    TERMINADO: theme.palette.primary.main,
  };

  const data = ESTADOS.map((e) => ({
    ...e,
    count: reparaciones.filter((r) => r.estado === e.estado).length,
  }));
  const total = data.reduce((acc, d) => acc + d.count, 0);

  return (
    <Card variant="outlined" sx={{ boxShadow: 'none', borderRadius: 2 }}>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Estado de reparaciones
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {total} activa{total === 1 ? '' : 's'}
          </Typography>
        </Box>
        {total === 0 ? (
          <Stack alignItems="center" spacing={1} sx={{ py: 3, textAlign: 'center' }}>
            <CheckCircleOutlineIcon sx={{ fontSize: 36, color: 'text.disabled' }} />
            <Typography variant="body2" color="text.secondary">
              Sin reparaciones activas
            </Typography>
          </Stack>
        ) : (
          <Stack spacing={1.5} sx={{ mt: 1.5 }}>
            <Box
              sx={{
                display: 'flex',
                height: 12,
                borderRadius: 999,
                overflow: 'hidden',
                bgcolor: 'action.hover',
              }}
              role="img"
              aria-label="Distribución de estados de reparaciones"
            >
              {data.map((d) =>
                d.count === 0 ? null : (
                  <Box key={d.estado} sx={{ flexBasis: `${(d.count / total) * 100}%`, bgcolor: colores[d.estado] }} />
                ),
              )}
            </Box>
            <Stack spacing={1}>
              {data.map((d) => {
                const pct = total === 0 ? 0 : Math.round((d.count / total) * 100);
                return (
                  <Stack key={d.estado} direction="row" alignItems="center" spacing={1}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: colores[d.estado],
                        flexShrink: 0,
                      }}
                    />
                    <Stack direction="row" alignItems="center" spacing={0.75} sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ color: 'text.secondary', display: 'flex', flexShrink: 0 }}>{d.icon}</Box>
                      <Typography variant="body2" color="text.secondary" noWrap sx={{ flex: 1 }}>
                        {d.label}
                      </Typography>
                    </Stack>
                    <Tooltip title={`${d.count} de ${total}`} arrow>
                      <Typography variant="body2" fontWeight={600} sx={{ whiteSpace: 'nowrap' }}>
                        {d.count}
                        {d.count > 0 && ` · ${pct}%`}
                      </Typography>
                    </Tooltip>
                  </Stack>
                );
              })}
            </Stack>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
