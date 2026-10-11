import { useCallback, useEffect, useState } from 'react';
import { Alert, Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BuildIcon from '@mui/icons-material/Build';
import HandymanIcon from '@mui/icons-material/Handyman';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import GroupsIcon from '@mui/icons-material/Groups';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { getReparaciones } from '../../api/reparacionApi';
import { getMecanicos } from '../../api/mecanicoApi';
import { getPiezas } from '../../api/piezaApi';
import { getUbicaciones } from '../../api/ubicacionApi';
import { getErrorMessage } from '../../api/errorMessage';
import Loading from '../common/Loading';
import type { EstadoReparacion, Mecanico, Pieza, Reparacion, Ubicacion } from '../../types';
import DashboardKpiCard from './DashboardKpiCard';
import RecentRepairs from './RecentRepairs';
import RepairStatusSummary from './RepairStatusSummary';
import LowStockAlerts from './LowStockAlerts';
import OperationsBoard from './OperationsBoard';
import QuickActions from './QuickActions';

const ESTADOS_EN_TALLER: EstadoReparacion[] = ['EN_REVISION', 'EN_REPARACION', 'TERMINADO', 'FACTURADO', 'PAGADO'];

export default function Dashboard() {
  const [reparaciones, setReparaciones] = useState<Reparacion[]>([]);
  const [mecanicos, setMecanicos] = useState<Mecanico[]>([]);
  const [piezas, setPiezas] = useState<Pieza[]>([]);
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchData = useCallback(async (silent = false) => {
    if (silent) setRefreshing(true);
    else setLoading(true);
    try {
      const [rRes, mRes, pRes, uRes] = await Promise.all([
        getReparaciones(),
        getMecanicos(),
        getPiezas(),
        getUbicaciones(true),
      ]);
      setReparaciones(rRes.data);
      setMecanicos(mRes.data);
      setPiezas(pRes.data);
      setUbicaciones(uRes.data.filter((x) => x.activo));
      setErrorMsg('');
    } catch (err) {
      setErrorMsg(getErrorMessage(err, 'No se pudieron cargar los datos del panel'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const enTaller = reparaciones.filter((r) => ESTADOS_EN_TALLER.includes(r.estado)).length;
  const enRevision = reparaciones.filter((r) => r.estado === 'EN_REVISION').length;
  const enReparacion = reparaciones.filter((r) => r.estado === 'EN_REPARACION').length;
  const terminados = reparaciones.filter((r) => r.estado === 'TERMINADO').length;
  const stockBajo = piezas.filter((p) => p.stock <= 5).length;

  const kpis = [
    {
      label: 'Autos en taller',
      value: enTaller,
      icon: <DirectionsCarIcon fontSize="small" />,
      bgcolor: 'rgba(13, 71, 161, 0.12)',
      color: 'primary.main',
      to: '/reparaciones',
    },
    {
      label: 'En revisión',
      value: enRevision,
      icon: <BuildIcon fontSize="small" />,
      bgcolor: 'rgba(237, 108, 2, 0.12)',
      color: 'warning.main',
      to: '/reparaciones',
    },
    {
      label: 'En reparación',
      value: enReparacion,
      icon: <HandymanIcon fontSize="small" />,
      bgcolor: 'rgba(2, 136, 209, 0.12)',
      color: 'info.main',
      to: '/reparaciones',
    },
    {
      label: 'Terminados',
      value: terminados,
      icon: <CheckCircleOutlineIcon fontSize="small" />,
      bgcolor: 'rgba(46, 125, 50, 0.12)',
      color: 'success.main',
      to: '/reparaciones',
    },
    {
      label: 'Mecánicos',
      value: mecanicos.length,
      icon: <GroupsIcon fontSize="small" />,
      bgcolor: 'rgba(230, 81, 0, 0.12)',
      color: 'secondary.main',
      to: '/mecanicos',
    },
    {
      label: 'Repuestos bajo stock',
      value: stockBajo,
      icon: <WarningAmberIcon fontSize="small" />,
      bgcolor: 'rgba(211, 47, 47, 0.12)',
      color: 'error.main',
      to: '/inventario',
    },
  ];

  const Header = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 1,
      }}
    >
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Panel del taller
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Resumen de la actividad y el estado del taller
        </Typography>
      </Box>
      <Button
        size="medium"
        variant="outlined"
        onClick={() => fetchData(true)}
        disabled={refreshing}
        startIcon={refreshing ? <CircularProgress size={16} color="inherit" /> : <RefreshIcon />}
      >
        Actualizar
      </Button>
    </Box>
  );

  if (loading) return <Loading message="Cargando panel..." />;

  if (errorMsg && reparaciones.length === 0) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {Header}
        <DashboardErrorState message={errorMsg} onRetry={() => fetchData()} connecting={refreshing} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, minHeight: 0 }}>
      {Header}
      {errorMsg && (
        <Alert severity="error" onClose={() => setErrorMsg('')}>
          {errorMsg}
        </Alert>
      )}
      <Box
        sx={{
          display: 'grid',
          gap: 1.5,
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', xl: 'repeat(6, 1fr)' },
        }}
      >
        {kpis.map((k) => (
          <DashboardKpiCard key={k.label} {...k} />
        ))}
      </Box>
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          alignItems: 'start',
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 2fr) minmax(0, 1fr)' },
        }}
      >
        <RecentRepairs reparaciones={reparaciones} />
        <Stack spacing={2}>
          <RepairStatusSummary reparaciones={reparaciones} />
          <LowStockAlerts piezas={piezas} />
        </Stack>
      </Box>
      <OperationsBoard
        reparaciones={reparaciones}
        mecanicos={mecanicos}
        ubicaciones={ubicaciones}
        piezas={piezas}
        onChanged={() => fetchData(true)}
      />
      <QuickActions />
    </Box>
  );
}

function DashboardErrorState({
  message,
  onRetry,
  connecting,
}: {
  message: string;
  onRetry: () => void;
  connecting: boolean;
}) {
  return (
    <Stack spacing={2} sx={{ alignItems: 'center', py: 8, textAlign: 'center' }}>
      <WarningAmberIcon sx={{ fontSize: 44, color: 'error.main' }} />
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        No fue posible cargar el panel
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
      <Button variant="outlined" size="medium" onClick={onRetry} disabled={connecting} startIcon={<RefreshIcon />}>
        Reintentar
      </Button>
    </Stack>
  );
}
