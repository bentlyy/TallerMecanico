import React, { useEffect, useState } from 'react';
import {
  List, ListItem, ListItemText, IconButton, Typography, Divider, Button, Box, MenuItem, TextField
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { getAllReparaciones, deleteReparacion, cambiarEstado, asignarMecanico } from '../../api/reparacionApi';
import { getAllMecanicos } from '../../api/mecanicoApi';
import { Reparacion } from '../../types';

interface Props {
  onEdit: (r: Reparacion) => void;
  onCreate: () => void;
}

type AssignMap = Record<number, number | ''>;

const ReparacionList: React.FC<Props> = ({ onEdit, onCreate }) => {
  const [reparaciones, setReparaciones] = useState<Reparacion[]>([]);
  const [mecanicos, setMecanicos] = useState<any[]>([]);
  const [refreshToggle, setRefreshToggle] = useState(false);
  const [assigningTo, setAssigningTo] = useState<AssignMap>({});

  const fetch = () => {
    getAllReparaciones()
      .then(res => setReparaciones(res.data))
      .catch(err => {
        console.error(err);
        setReparaciones([]);
      });
  };

  useEffect(() => {
    fetch();
    getAllMecanicos().then(res => setMecanicos(res.data)).catch(() => setMecanicos([]));
  }, [refreshToggle]);

  const handleDelete = async (id: number) => {
    if (!confirm('Eliminar reparación?')) return;
    await deleteReparacion(id);
    setRefreshToggle(t => !t);
  };

  const handleChangeEstado = async (id: number, nuevo: string) => {
    await cambiarEstado(id, nuevo);
    setRefreshToggle(t => !t);
  };

  const handleAssign = async (id: number) => {
    const mech = assigningTo[id];
    if (mech === '' || mech == null) {
      alert('Seleccione un mecánico');
      return;
    }
    await asignarMecanico(id, Number(mech));
    setAssigningTo(prev => ({ ...prev, [id]: '' }));
    setRefreshToggle(t => !t);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Reparaciones</Typography>
        <Button variant="contained" onClick={onCreate}>Crear Reparación</Button>
      </Box>

      <List>
        {reparaciones.map(r => (
          <React.Fragment key={r.id}>
            <ListItem
              secondaryAction={
                <>
                  <IconButton edge="end" onClick={() => onEdit(r)} title="Editar">
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" onClick={() => handleDelete(r.id)} title="Eliminar">
                    <DeleteIcon />
                  </IconButton>
                </>
              }
            >
              <ListItemText
                primary={`${r.descripcion}`}
                secondary={
                  <>
                    <div>Estado: {r.estado} — Vehículo: {r.vehiculoId} — Mecánico: {r.mecanicoId ?? 'N/A'}</div>
                    <div>Entrada: {new Date(r.fechaEntrada).toLocaleString()}</div>
                    <div>Costo mano obra: {Number(r.costoManoObra ?? 0).toFixed(2)}</div>
                  </>
                }
              />
            </ListItem>

            <Box sx={{ px: 2, pb: 1, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <TextField
                select
                size="small"
                label="Cambiar estado"
                value=""
                onChange={(e) => handleChangeEstado(r.id, e.target.value)}
                sx={{ width: 200 }}
              >
                <MenuItem value="EN_REVISION">EN_REVISION</MenuItem>
                <MenuItem value="EN_REPARACION">EN_REPARACION</MenuItem>
                <MenuItem value="TERMINADO">TERMINADO</MenuItem>
                <MenuItem value="ENTREGADO">ENTREGADO</MenuItem>
              </TextField>

              <TextField
                select
                size="small"
                label="Asignar mecánico"
                value={assigningTo[r.id] ?? ''}
                onChange={(e) => {
                  const val = e.target.value === '' ? '' : Number(e.target.value);
                  setAssigningTo(prev => ({ ...prev, [r.id]: val }));
                }}
                sx={{ width: 220 }}
              >
                <MenuItem value="">-- Ninguno --</MenuItem>
                {mecanicos.map(m => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.usuario?.nombre ?? `Mecánico ${m.id}`}
                  </MenuItem>
                ))}
              </TextField>

              <Button size="small" variant="outlined" onClick={() => handleAssign(r.id)} startIcon={<PlayArrowIcon />}>
                Asignar
              </Button>

              <Button size="small" variant="outlined" onClick={() => handleChangeEstado(r.id, 'TERMINADO')} startIcon={<DoneAllIcon />}>
                Marcar terminado
              </Button>
            </Box>

            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default ReparacionList;
