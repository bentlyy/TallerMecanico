import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff, Build } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Completa todos los campos');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

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
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ mb: 2 }}
              autoFocus
            />
            <TextField
              fullWidth
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ py: 1.5, fontSize: 16 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Iniciar Sesión'}
            </Button>
          </Box>
          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 600 }}>
              Credenciales de prueba:
            </Typography>
            <Typography variant="caption" display="block">
              Admin: admin@taller.com / admin123
            </Typography>
            <Typography variant="caption" display="block">
              Recepcionista: recepcion@taller.com / admin123
            </Typography>
            <Typography variant="caption" display="block">
              Mecánico: mecanico@taller.com / admin123
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
