// src/App.tsx
import './App.scss';

import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { ClientesPage } from "./pages/ClientesPage";
import { VehiculosPage } from "./pages/VehiculosPage";
import RolesPage from './pages/RolesPage';
import UsuariosPage from "./pages/UsuarioPage";
import MecanicoPage from "./pages/MecanicoPage";
import PiezaPage from "./pages/PiezaPage";
import ReparacionForm from "./components/Reparacion/ReparacionForm";
import ReparacionPage from "./pages/ReparacionPage";
import FacturaPage from "./pages/FacturaPage";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <NavLink to="/clientes" className={({ isActive }) => (isActive ? 'active' : '')}>
          Clientes
        </NavLink>{" | "}
        <NavLink to="/vehiculos" className={({ isActive }) => (isActive ? 'active' : '')}>
          Vehículos
        </NavLink>{" | "}
        <NavLink to="/roles" className={({ isActive }) => (isActive ? 'active' : '')}>
          Roles
        </NavLink>{" | "}
        <NavLink to="/mecanicos" className={({ isActive }) => (isActive ? 'active' : '')}>
          Mecanicos
        </NavLink>{" | "}
        <NavLink to="/usuarios" className={({ isActive }) => (isActive ? 'active' : '')}>
          Usuarios
        </NavLink>{" | "}
        <NavLink to="/piezas" className={({ isActive }) => (isActive ? 'active' : '')}>
          Piezas
        </NavLink>{" | "}
        <NavLink to="/reparaciones" className={({ isActive }) => (isActive ? 'active' : '')}>
          Reparaciones
        </NavLink>{" | "}
        <NavLink to="/facturas" className={({ isActive }) => (isActive ? 'active' : '')}>
          Facturas
        </NavLink>{" | "}
      </nav>

      <div className="main-content">
        <Routes>
          <Route path="/clientes" element={<ClientesPage />} />
          <Route path="/vehiculos" element={<VehiculosPage />} />
          <Route path="/roles" element={<RolesPage />} />
          <Route path="/usuarios" element={<UsuariosPage />} />
          <Route path="/mecanicos" element={<MecanicoPage />} />
          <Route path="/piezas" element={<PiezaPage />} />
          <Route path="/reparaciones" element={<ReparacionPage />} />
          <Route path="/facturas" element={<FacturaPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;