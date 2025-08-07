import React, { useEffect, useState } from 'react';
import { getPiezas, deletePieza } from '../../api/piezaApi';
import { Pieza } from '../../types';
import PiezaForm from './PiezaForm';

const PiezaList: React.FC = () => {
  const [piezas, setPiezas] = useState<Pieza[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchPiezas = async () => {
    const data = await getPiezas();
    setPiezas(data);
  };

  useEffect(() => {
    fetchPiezas();
  }, []);

  const handleDelete = async (id: number) => {
    await deletePieza(id);
    fetchPiezas();
  };

  const handleEdit = (id: number) => {
    setSelectedId(id);
    setShowForm(true);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setSelectedId(null);
    fetchPiezas();
  };

  return (
    <div>
      <h2>Piezas</h2>
      <button onClick={() => { setShowForm(!showForm); setSelectedId(null); }}>
        {showForm ? 'Cancelar' : 'Nueva Pieza'}
      </button>

      {showForm && <PiezaForm piezaId={selectedId ?? undefined} onSuccess={handleSuccess} />}

      <ul>
        {piezas.map(p => (
          <li key={p.id}>
            {p.nombre} ({p.codigo}) - {p.precio} USD - Stock: {p.stock}
            <button onClick={() => handleEdit(p.id)}>Editar</button>
            <button onClick={() => handleDelete(p.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PiezaList;
