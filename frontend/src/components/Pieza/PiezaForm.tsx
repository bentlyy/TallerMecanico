import React, { useState, useEffect } from 'react';
import { createPieza, updatePieza, getPiezaById } from '../../api/piezaApi';
import { Pieza } from '../../types';

interface Props {
  piezaId?: number;
  onSuccess: () => void;
}

const PiezaForm: React.FC<Props> = ({ piezaId, onSuccess }) => {
  const [pieza, setPieza] = useState<Omit<Pieza, 'id'>>({
    nombre: '',
    marca: '',
    precio: 0,
    stock: 0,
    codigo: ''
  });

  useEffect(() => {
    if (piezaId) {
      getPiezaById(piezaId).then((data) => setPieza(data));
    }
  }, [piezaId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPieza({ ...pieza, [name]: name === 'precio' || name === 'stock' ? Number(value) : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (piezaId) {
      await updatePieza(piezaId, pieza);
    } else {
      await createPieza(pieza);
    }
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="nombre" placeholder="Nombre" value={pieza.nombre} onChange={handleChange} required />
      <input name="marca" placeholder="Marca" value={pieza.marca ?? ''} onChange={handleChange} />
      <input name="precio" type="number" placeholder="Precio" value={pieza.precio} onChange={handleChange} required />
      <input name="stock" type="number" placeholder="Stock" value={pieza.stock} onChange={handleChange} />
      <input name="codigo" placeholder="Código" value={pieza.codigo} onChange={handleChange} required />
      <button type="submit">{piezaId ? 'Actualizar' : 'Crear'}</button>
    </form>
  );
};

export default PiezaForm;
