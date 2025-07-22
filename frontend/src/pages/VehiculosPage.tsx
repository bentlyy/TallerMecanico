// src/pages/VehiculosPage.tsx
import  VehiculoForm  from "../components/Vehiculo/VehiculoForm";
import  VehiculoList  from "../components/Vehiculo/VehiculoList";

export const VehiculosPage = () => {
  return (
    <div>
      <h1>Vehículos</h1>
      <VehiculoForm />
      <VehiculoList />
    </div>
  );
};