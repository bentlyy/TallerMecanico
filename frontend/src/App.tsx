import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import theme from './theme';
import Layout from './components/Layout/Layout';
import LoginPage from './components/Login/LoginPage';
import Dashboard from './components/Dashboard/Dashboard';
import ClientesPage from './pages/ClientesPage';
import VehiculosPage from './pages/VehiculosPage';
import ReparacionesPage from './pages/ReparacionesPage';
import PiezasPage from './pages/PiezasPage';
import MecanicosPage from './pages/MecanicosPage';
import FacturasPage from './pages/FacturasPage';
import UsuariosPage from './pages/UsuariosPage';
import RolesPage from './pages/RolesPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/clientes" element={<ClientesPage />} />
              <Route path="/vehiculos" element={<VehiculosPage />} />
              <Route path="/reparaciones" element={<ReparacionesPage />} />
              <Route path="/piezas" element={<PiezasPage />} />
              <Route path="/mecanicos" element={<MecanicosPage />} />
              <Route path="/facturas" element={<FacturasPage />} />
              <Route path="/usuarios" element={<UsuariosPage />} />
              <Route path="/roles" element={<RolesPage />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
