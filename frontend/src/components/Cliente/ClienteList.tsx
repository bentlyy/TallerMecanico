import { useEffect, useState } from 'react';
import { getAllClientes } from '../../api/clienteApi';
import styles from './ClienteList.module.scss';


export const ClienteList = () => {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    getAllClientes()
      .then((res) => setClientes(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className={styles.listContainer}>
      <h2 className={styles.listTitle}>Listado de Clientes</h2>
      <ul>
        {clientes.map((cliente: any) => (
          <li key={cliente.id} className={styles.listItem}>
            {cliente.nombre} - {cliente.email}
          </li>
        ))}
      </ul>
    </div>
  );
};
