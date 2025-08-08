import React, { useState, useEffect } from 'react';
import { createPieza, updatePieza, getPiezaById } from '../../api/piezaApi';
import { Pieza } from '../../types';

interface Props {
  piezaId?: number;
  onSuccess: () => void;
}

const PiezaForm: React.FC<Props> = ({ piezaId, onSuccess }) => {
  const [pieza, setPieza] = useState({
    nombre: '',
    marca: '',
    precio: '',
    stock: '',
    codigo: ''
  });

  useEffect(() => {
    if (piezaId) {
      getPiezaById(piezaId).then((data) =>
        setPieza({
          nombre: data.nombre || '',
          marca: data.marca || '',
          precio: data.precio?.toString() || '',
          stock: data.stock?.toString() || '',
          codigo: data.codigo || ''
        })
      );
    }
  }, [piezaId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPieza((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Omit<Pieza, 'id'> = {
      ...pieza,
      precio: Number(pieza.precio),
      stock: Number(pieza.stock)
    };
    if (piezaId) {
      await updatePieza(piezaId, payload);
    } else {
      await createPieza(payload);
    }
    onSuccess();
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        maxWidth: '300px'
      }}
    >
      <input
        name="nombre"
        placeholder="Nombre"
        value={pieza.nombre}
        onChange={handleChange}
        required
      />
      <input
        name="marca"
        placeholder="Marca"
        value={pieza.marca}
        onChange={handleChange}
      />
      <input
        name="precio"
        type="number"
        placeholder="Precio"
        value={pieza.precio}
        onChange={handleChange}
        min="0"
      />
      <input
        name="stock"
        type="number"
        placeholder="Stock"
        value={pieza.stock}
        onChange={handleChange}
        min="0"
      />
      <input
        name="codigo"
        placeholder="Código"
        value={pieza.codigo}
        onChange={handleChange}
        required
      />
      <button type="submit">
        {piezaId ? 'Actualizar' : 'Crear'}
      </button>
    </form>
  );
};

export default PiezaForm;
