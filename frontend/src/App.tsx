// src/App.tsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { ClientesPage } from "./pages/ClientesPage";
import { VehiculosPage } from "./pages/VehiculoPage";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/clientes">Clientes</Link> |{" "}
        <Link to="/vehiculos">Vehículos</Link>
      </nav>
      <Routes>
        <Route path="/clientes" element={<ClientesPage />} />
        <Route path="/vehiculos" element={<VehiculosPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;