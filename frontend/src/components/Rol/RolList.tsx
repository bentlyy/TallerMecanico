import React, { useEffect, useState } from 'react';
import { getAllRoles, deleteRol } from '../../api/rolApi';
import { Rol } from '../../types';
import { 
  Box, Button, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle 
} from '@mui/material';

interface Props {
  onEdit: (rol: Rol) => void;
}

const RolList: React.FC<Props> = ({ onEdit }) => {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await getAllRoles();
      setRoles(res.data);
      setError(null);
    } catch {
      setError('Error al cargar los roles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteRol(id);
      setDeleteId(null);
      fetchRoles();
    } catch {
      setError('Error al eliminar el rol');
    }
  };

  return (
    <Box>
      <Typography variant="h4" mb={2}>Roles</Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Permisos (JSON)</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((rol) => (
              <TableRow key={rol.id}>
                <TableCell>{rol.id}</TableCell>
                <TableCell>{rol.nombre}</TableCell>
                <TableCell>
                  <pre style={{ maxHeight: 100, overflow: 'auto' }}>
                    {JSON.stringify(rol.permisos, null, 2)}
                  </pre>
                </TableCell>
                <TableCell>
                  <Button onClick={() => onEdit(rol)} variant="outlined" size="small" sx={{ mr: 1 }}>
                    Editar
                  </Button>
                  <Button color="error" variant="outlined" size="small" onClick={() => setDeleteId(rol.id)}>
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={deleteId !== null} onClose={() => setDeleteId(null)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>¿Seguro que quieres eliminar este rol?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancelar</Button>
          <Button color="error" onClick={() => deleteId !== null && handleDelete(deleteId)}>Eliminar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RolList;
