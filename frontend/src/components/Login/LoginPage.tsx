import { useEffect } from 'react';
import { Box, Card, CardContent, Typography, CircularProgress, Link } from '@mui/material';
import { Build } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginPage() {
  const { login, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (isAuthenticated) {
      window.location.replace('/dashboard');
      return;
    }
    login();
  }, [loading, isAuthenticated, login]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 50%, #1976d2 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.03)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -60,
          left: -60,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.03)',
        }}
      />
      <Card sx={{ width: 420, maxWidth: '90vw', position: 'relative', zIndex: 1 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Build sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
              TallerPro
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sistema de Gestión de Talleres Mecánicos
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 3 }}>
            <CircularProgress />
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              {isAuthenticated ? 'Entrando al taller…' : 'Entrando con tu cuenta AMG…'}
            </Typography>
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 3, textAlign: 'center' }}>
            El acceso lo gestiona la cuenta central de AMG.{' '}
            <Link component="button" type="button" onClick={login} underline="hover" sx={{ cursor: 'pointer' }}>
              Reintentar
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
