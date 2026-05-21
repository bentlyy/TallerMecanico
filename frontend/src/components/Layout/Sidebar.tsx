import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  DirectionsCar as CarIcon,
  Build as BuildIcon,
  Handyman as HandymanIcon,
  Receipt as ReceiptIcon,
  Inventory as InventoryIcon,
  SupervisedUserCircle as UserIcon,
  Security as SecurityIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const drawerWidth = 260;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon />, roles: ['ADMIN', 'RECEPCIONISTA', 'MECANICO'] },
  { path: '/clientes', label: 'Clientes', icon: <PeopleIcon />, roles: ['ADMIN', 'RECEPCIONISTA'] },
  { path: '/vehiculos', label: 'Vehículos', icon: <CarIcon />, roles: ['ADMIN', 'RECEPCIONISTA', 'MECANICO'] },
  { path: '/reparaciones', label: 'Reparaciones', icon: <BuildIcon />, roles: ['ADMIN', 'RECEPCIONISTA', 'MECANICO'] },
  { path: '/mecanicos', label: 'Mecánicos', icon: <HandymanIcon />, roles: ['ADMIN'] },
  { path: '/piezas', label: 'Piezas', icon: <InventoryIcon />, roles: ['ADMIN', 'RECEPCIONISTA', 'MECANICO'] },
  { path: '/facturas', label: 'Facturas', icon: <ReceiptIcon />, roles: ['ADMIN', 'RECEPCIONISTA'] },
  { path: '/usuarios', label: 'Usuarios', icon: <UserIcon />, roles: ['ADMIN'] },
  { path: '/roles', label: 'Roles', icon: <SecurityIcon />, roles: ['ADMIN'] },
];

export default function Sidebar({ open, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const visibleItems = menuItems.filter((item) => user && item.roles.includes(user.rolNombre));

  const content = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <BuildIcon sx={{ color: 'primary.main', fontSize: 32 }} />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2, color: 'primary.main' }}>
            TallerPro
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {user?.rolNombre === 'ADMIN'
              ? 'Administrador'
              : user?.rolNombre === 'RECEPCIONISTA'
                ? 'Recepcionista'
                : 'Mecánico'}
          </Typography>
        </Box>
      </Box>
      <Divider />
      <List sx={{ flex: 1, pt: 1 }}>
        {visibleItems.map((item) => {
          const selected = location.pathname === item.path;
          return (
            <ListItemButton
              key={item.path}
              selected={selected}
              onClick={() => {
                navigate(item.path);
                if (isMobile) onClose();
              }}
              sx={{
                mx: 1,
                my: 0.5,
                borderRadius: 2,
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': { backgroundColor: 'primary.dark' },
                  '& .MuiListItemIcon-root': { color: 'white' },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }} />
            </ListItemButton>
          );
        })}
      </List>
      <Divider />
      <List sx={{ pb: 2 }}>
        <ListItemButton onClick={logout} sx={{ mx: 1, borderRadius: 2, color: 'error.main' }}>
          <ListItemIcon sx={{ minWidth: 40, color: 'error.main' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Cerrar Sesión" primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }} />
        </ListItemButton>
      </List>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onClose={onClose} sx={{ '& .MuiDrawer-paper': { width: drawerWidth } }}>
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      {content}
    </Drawer>
  );
}
