// src/App.tsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { ClientesPage } from "./pages/ClientesPage";
import { VehiculosPage } from "./pages/VehiculosPage";
import RolesPage from './pages/RolesPage';
import UsuariosPage from "./pages/UsuarioPage";
import MecanicoPage from "./pages/MecanicoPage";
import PiezaPage from "./pages/PiezaPage";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/clientes">Clientes</Link> |{" "}
        <Link to="/vehiculos">Vehículos</Link> |{" "}
        <Link to="/roles">Roles</Link> |{" "}
        <Link to="/mecanicos">Mecanicos</Link> |{" "}
        <Link to="/usuarios">Usuarios</Link> |{" "}
        <Link to="/piezas">Piezas</Link> |{" "}
      </nav>
      <Routes>
        <Route path="/clientes" element={<ClientesPage />} />
        <Route path="/vehiculos" element={<VehiculosPage />} />
        <Route path="/roles" element={<RolesPage />} />
        <Route path="/usuarios" element={<UsuariosPage />} />
        <Route path="/mecanicos" element={<MecanicoPage />} />
        <Route path="/piezas" element={<PiezaPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;