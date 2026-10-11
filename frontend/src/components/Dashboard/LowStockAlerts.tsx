import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import type { Pieza } from '../../types';

interface Props {
  piezas: Pieza[];
}

const STOCK_MINIMO = 5;
const LIMITE = 5;

export default function LowStockAlerts({ piezas }: Props) {
  const navigate = useNavigate();
  const alertas = useMemo(
    () =>
      piezas
        .filter((p) => p.stock <= STOCK_MINIMO)
        .sort((a, b) => a.stock - b.stock)
        .slice(0, LIMITE),
    [piezas],
  );

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
            mb: 1,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={0.75}>
            <WarningAmberIcon fontSize="small" color="warning" />
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Repuestos con bajo stock
            </Typography>
          </Stack>
        </Box>
        {alertas.length === 0 ? (
          <Stack alignItems="center" spacing={1} sx={{ py: 3, textAlign: 'center' }}>
            <CheckCircleOutlineIcon sx={{ fontSize: 36, color: 'success.main' }} />
            <Typography variant="body2" color="text.secondary">
              No hay repuestos con stock bajo
            </Typography>
          </Stack>
        ) : (
          <Stack spacing={1}>
            {alertas.map((p) => (
              <Stack
                key={p.id}
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{
                  p: 1,
                  borderRadius: 1.5,
                  bgcolor: 'rgba(211, 47, 47, 0.05)',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <WarningAmberIcon sx={{ fontSize: 20, color: 'error.main', flexShrink: 0 }} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
                    {p.nombre}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {p.codigo}
                  </Typography>
                </Box>
                <Chip label={`${p.stock} uds`} size="small" color="error" variant="outlined" sx={{ flexShrink: 0 }} />
              </Stack>
            ))}
          </Stack>
        )}
        <Button
          size="small"
          onClick={() => navigate('/inventario')}
          endIcon={<ArrowForwardIcon />}
          sx={{ mt: 1.5, textTransform: 'none' }}
        >
          Ver inventario
        </Button>
      </CardContent>
    </Card>
  );
}
