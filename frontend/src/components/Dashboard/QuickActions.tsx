import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardActionArea, Stack, Typography } from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface Accion {
  label: string;
  icon: ReactNode;
  to: string;
}

const acciones: Accion[] = [
  { label: 'Nueva reparación', icon: <BuildIcon />, to: '/reparaciones' },
  { label: 'Registrar cliente', icon: <PersonAddIcon />, to: '/clientes' },
  { label: 'Agregar repuesto', icon: <Inventory2Icon />, to: '/inventario' },
  { label: 'Crear factura', icon: <ReceiptIcon />, to: '/facturas' },
];

export default function QuickActions() {
  const navigate = useNavigate();
  return (
    <Card variant="outlined" sx={{ boxShadow: 'none', borderRadius: 2 }}>
      <Box sx={{ px: 2, pt: 2, pb: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Accesos rápidos
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 1.5,
          p: 2,
          pt: 1,
        }}
      >
        {acciones.map((a) => (
          <Card key={a.label} variant="outlined" sx={{ boxShadow: 'none', borderRadius: 2 }}>
            <CardActionArea
              onClick={() => navigate(a.to)}
              sx={{ p: 1.75, display: 'flex', alignItems: 'center', gap: 1.5 }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 38,
                  height: 38,
                  borderRadius: 2,
                  bgcolor: 'rgba(13, 71, 161, 0.1)',
                  color: 'primary.main',
                  flexShrink: 0,
                }}
              >
                {a.icon}
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 600, flex: 1 }}>
                {a.label}
              </Typography>
              <ChevronRightIcon sx={{ color: 'text.disabled', flexShrink: 0 }} />
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Card>
  );
}
