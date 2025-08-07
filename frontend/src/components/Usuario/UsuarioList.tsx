import React, { useEffect, useState } from 'react';
import { getAllUsuarios, deleteUsuario } from '../../api/usuarioApi';
import { getAllRoles } from '../../api/rolApi';
import { Usuario, Rol } from '../../types';
import {
  Box, Button, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow,
  Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';

interface Props {
  onEdit: (usuario: Usuario) => void;
}

const UsuarioList: React.FC<Props> = ({ onEdit }) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [rolesMap, setRolesMap] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usuarioRes, rolRes] = await Promise.all([getAllUsuarios(), getAllRoles()]);
      setUsuarios(usuarioRes.data);
      const map: Record<number, string> = {};
      rolRes.data.forEach((rol: Rol) => {
        map[rol.id] = rol.nombre;
      });
      setRolesMap(map);
      setError(null);
    } catch {
      setError('Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteUsuario(id);
      setDeleteId(null);
      fetchData();
    } catch {
      setError('Error al eliminar el usuario');
    }
  };

  return (
    <Box>
      <Typography variant="h4" mb={2}>Usuarios</Typography>

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
              <TableCell>Email</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map((usuario) => (
              <TableRow key={usuario.id}>
                <TableCell>{usuario.id}</TableCell>
                <TableCell>{usuario.nombre}</TableCell>
                <TableCell>{usuario.email}</TableCell>
                <TableCell>{rolesMap[usuario.rolId] || 'Sin rol'}</TableCell>
                <TableCell>
                  <Button onClick={() => onEdit(usuario)} variant="outlined" size="small" sx={{ mr: 1 }}>
                    Editar
                  </Button>
                  <Button color="error" variant="outlined" size="small" onClick={() => setDeleteId(usuario.id)}>
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
          <DialogContentText>¿Seguro que quieres eliminar este usuario?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancelar</Button>
          <Button color="error" onClick={() => deleteId !== null && handleDelete(deleteId)}>Eliminar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsuarioList;
