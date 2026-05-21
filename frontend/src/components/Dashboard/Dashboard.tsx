import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { Card, CardContent, Typography, Box, Button } from '@mui/material';
import { People, DirectionsCar, Build, Receipt, Handyman, Warning } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Loading from '../common/Loading';

interface Stats {
  clientes: number;
  vehiculos: number;
  reparacionesPendientes: number;
  reparacionesEnProceso: number;
  reparacionesCompletadas: number;
  piezasStockBajo: number;
  mecanicos: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [clientes, vehiculos, reparaciones, piezas, mecanicos] = await Promise.all([
          api.get('/clientes'),
          api.get('/vehiculos'),
          api.get('/reparaciones'),
          api.get('/piezas'),
          api.get('/mecanicos'),
        ]);
        setStats({
          clientes: clientes.data.length,
          vehiculos: vehiculos.data.length,
          reparacionesPendientes: reparaciones.data.filter((r: any) => r.estado === 'EN_REVISION').length,
          reparacionesEnProceso: reparaciones.data.filter((r: any) => r.estado === 'EN_REPARACION').length,
          reparacionesCompletadas: reparaciones.data.filter(
            (r: any) => r.estado === 'TERMINADO' || r.estado === 'ENTREGADO',
          ).length,
          piezasStockBajo: piezas.data.filter((p: any) => p.stock <= 5).length,
          mecanicos: mecanicos.data.length,
        });
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loading message="Cargando dashboard..." />;

  const cards = [
    {
      label: 'Clientes',
      value: stats?.clientes ?? 0,
      icon: <People sx={{ fontSize: 40 }} />,
      color: '#0d47a1',
      path: '/clientes',
    },
    {
      label: 'Vehículos',
      value: stats?.vehiculos ?? 0,
      icon: <DirectionsCar sx={{ fontSize: 40 }} />,
      color: '#1565c0',
      path: '/vehiculos',
    },
    {
      label: 'En Revisión',
      value: stats?.reparacionesPendientes ?? 0,
      icon: <Warning sx={{ fontSize: 40 }} />,
      color: '#e65100',
      path: '/reparaciones',
    },
    {
      label: 'En Reparación',
      value: stats?.reparacionesEnProceso ?? 0,
      icon: <Build sx={{ fontSize: 40 }} />,
      color: '#ed6c02',
      path: '/reparaciones',
    },
    {
      label: 'Completadas',
      value: stats?.reparacionesCompletadas ?? 0,
      icon: <Handyman sx={{ fontSize: 40 }} />,
      color: '#2e7d32',
      path: '/reparaciones',
    },
    {
      label: 'Mecánicos',
      value: stats?.mecanicos ?? 0,
      icon: <Build sx={{ fontSize: 40 }} />,
      color: '#6a1b9a',
      path: '/mecanicos',
    },
    {
      label: 'Stock Bajo',
      value: stats?.piezasStockBajo ?? 0,
      icon: <Warning sx={{ fontSize: 40 }} />,
      color: '#d32f2f',
      path: '/piezas',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={card.label}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' },
              }}
              onClick={() => navigate(card.path)}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: card.color }}>
                      {card.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {card.label}
                    </Typography>
                  </Box>
                  <Box sx={{ color: card.color, opacity: 0.8 }}>{card.icon}</Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button variant="contained" onClick={() => navigate('/reparaciones')} startIcon={<Build />}>
          Gestionar Reparaciones
        </Button>
        <Button variant="contained" color="secondary" onClick={() => navigate('/clientes')} startIcon={<People />}>
          Gestionar Clientes
        </Button>
        <Button variant="outlined" onClick={() => navigate('/facturas')} startIcon={<Receipt />}>
          Ver Facturas
        </Button>
      </Box>
    </Box>
  );
}
