import React, { useEffect, useState } from 'react';

interface Vehiculo {
  id: number;
  marca: string;
  modelo: string;
  año?: number;
  patente: string;
  kilometraje?: number;
  cliente_id: number;
}

function App() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);

  useEffect(() => {
    fetch('/api/vehiculos')
      .then(res => res.json())
      .then(data => setVehiculos(data))
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1>Vehículos</h1>
      <ul>
        {vehiculos.map(v => (
          <li key={v.id}>
            {v.marca} {v.modelo} - {v.patente}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
