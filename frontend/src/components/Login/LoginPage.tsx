import { Box, Card, CardContent, Button, Typography, CircularProgress } from '@mui/material';
import { Build, Login as LoginIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginPage() {
  const { login, loading, isAuthenticated } = useAuth();

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

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress />
            </Box>
          ) : isAuthenticated ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              Redirigiendo...
            </Typography>
          ) : (
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<LoginIcon />}
              onClick={login}
              sx={{ py: 1.5, fontSize: 16 }}
            >
              Iniciar sesión con AMG
            </Button>
          )}

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 3, textAlign: 'center' }}>
            El acceso lo gestiona la cuenta central de AMG.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
