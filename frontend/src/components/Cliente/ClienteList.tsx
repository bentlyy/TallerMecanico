import { useEffect, useState } from 'react';
import { getAllClientes } from '../../api/clienteApi';

export const ClienteList = () => {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    getAllClientes()
      .then((res) => setClientes(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>Listado de Clientes</h2>
      <ul>
        {clientes.map((cliente: any) => (
          <li key={cliente.id}>{cliente.nombre} - {cliente.email}</li>
        ))}
      </ul>
    </div>
  );
};