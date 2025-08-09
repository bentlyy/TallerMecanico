import { useState } from 'react';
import { createCliente } from '../../api/clienteApi';
import styles from  './ClienteForm.module.scss';

export const ClienteForm = () => {
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', direccion: '' });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await createCliente(form);
      alert('Cliente creado con éxito');
    } catch (error) {
      console.error(error);
      alert('Error al crear cliente');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <input
        name="nombre"
        placeholder="Nombre"
        onChange={handleChange}
        className={styles.inputField}
      />
      <input
        name="email"
        placeholder="Email"
        onChange={handleChange}
        className={styles.inputField}
      />
      <input
        name="telefono"
        placeholder="Teléfono"
        onChange={handleChange}
        className={styles.inputField}
      />
      <input
        name="direccion"
        placeholder="Dirección"
        onChange={handleChange}
        className={styles.inputField}
      />
      <button type="submit" className={styles.submitButton}>
        Crear Cliente
      </button>
    </form>
  );
};
