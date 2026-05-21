import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Box, AppBar, Toolbar, IconButton, Typography, CircularProgress } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AppBar
          position="sticky"
          color="default"
          elevation={0}
          sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'white' }}
        >
          <Toolbar>
            <IconButton edge="start" onClick={() => setSidebarOpen(true)} sx={{ mr: 2, display: { md: 'none' } }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flex: 1, fontWeight: 600, color: 'text.primary' }}>
              {user?.nombre ? `Bienvenido, ${user.nombre}` : 'TallerPro'}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {user?.email}
            </Typography>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 3, flex: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
