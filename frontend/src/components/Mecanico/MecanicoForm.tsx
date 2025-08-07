import React, { useEffect, useState } from 'react';
import { TextField, Button, MenuItem } from '@mui/material';
import { createMecanico, updateMecanico } from '../../api/mecanicoApi';
import { getAllUsuarios } from '../../api/usuarioApi';
import { Mecanico, Usuario } from '../../types';

interface Props {
  mecanico: Mecanico | null;
  onSave: () => void;
}

const MecanicoForm: React.FC<Props> = ({ mecanico, onSave }) => {
  const [usuarioId, setUsuarioId] = useState(mecanico?.usuarioId || 0);
  const [especialidad, setEspecialidad] = useState(mecanico?.especialidad || '');
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  useEffect(() => {
    getAllUsuarios().then(res => setUsuarios(res.data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { usuarioId, especialidad };

    if (mecanico?.id) {
      await updateMecanico(mecanico.id, data);
    } else {
      await createMecanico(data);
    }

    onSave();
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        select
        label="Usuario"
        value={usuarioId}
        onChange={(e) => setUsuarioId(Number(e.target.value))}
        fullWidth
        margin="normal"
        required
      >
        {usuarios.map((usuario) => (
          <MenuItem key={usuario.id} value={usuario.id}>
            {usuario.nombre}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Especialidad"
        value={especialidad}
        onChange={(e) => setEspecialidad(e.target.value)}
        fullWidth
        margin="normal"
      />

      <Button type="submit" variant="contained" color="primary">
        {mecanico ? 'Actualizar' : 'Crear'} Mecánico
      </Button>
    </form>
  );
};

export default MecanicoForm;
