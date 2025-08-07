import React, { useEffect, useState } from 'react';
import { getAllMecanicos, deleteMecanico } from '../../api/mecanicoApi';
import { Mecanico } from '../../types';
import {
  List, ListItem, ListItemText, IconButton, Typography, Divider, Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

interface Props {
  onEdit: (mecanico: Mecanico) => void;
  onCreate: () => void;
}

const MecanicoList: React.FC<Props> = ({ onEdit, onCreate }) => {
  const [mecanicos, setMecanicos] = useState<Mecanico[]>([]);

  const fetchData = () => {
    getAllMecanicos().then(res => setMecanicos(res.data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    await deleteMecanico(id);
    fetchData();
  };

  return (
    <>
      <Typography variant="h5">Lista de Mecánicos</Typography>
      <Button variant="contained" color="primary" onClick={onCreate} sx={{ mt: 2, mb: 2 }}>
        Crear nuevo Mecánico
      </Button>
      <List>
        {mecanicos.map((m) => (
          <React.Fragment key={m.id}>
            <ListItem
              secondaryAction={
                <>
                  <IconButton edge="end" onClick={() => onEdit(m)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" onClick={() => handleDelete(m.id)}>
                    <DeleteIcon />
                  </IconButton>
                </>
              }
            >
              <ListItemText
                primary={`Especialidad: ${m.especialidad || 'N/A'}`}
                secondary={`Usuario ID: ${m.usuarioId}`}
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </>
  );
};

export default MecanicoList;
