import { useEffect, useState } from 'react';
import { getAllUsuarios, deleteUsuario, activarUsuario, desactivarUsuario } from '../../api/usuarioApi';

export const UsuarioList = () => {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsuarios = async () => {
    try {
      const response = await getAllUsuarios();
      setUsuarios(response.data);
    } catch (err) {
      console.error('Error fetching usuarios:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      await deleteUsuario(id);
      fetchUsuarios();
    }
  };

  const toggleStatus = async (id: number, activo: boolean) => {
    if (activo) {
      await desactivarUsuario(id);
    } else {
      await activarUsuario(id);
    }
    fetchUsuarios();
  };

  if (loading) return <div>Cargando usuarios...</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Nombre</th>
            <th className="py-2 px-4 border">Email</th>
            <th className="py-2 px-4 border">Rol</th>
            <th className="py-2 px-4 border">Estado</th>
            <th className="py-2 px-4 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(usuario => (
            <tr key={usuario.id}>
              <td className="py-2 px-4 border">{usuario.nombre}</td>
              <td className="py-2 px-4 border">{usuario.email}</td>
              <td className="py-2 px-4 border">{usuario.rol?.nombre}</td>
              <td className="py-2 px-4 border">
                <button 
                  onClick={() => toggleStatus(usuario.id, usuario.activo)}
                  className={`px-2 rounded text-white ${usuario.activo ? 'bg-green-500' : 'bg-red-500'}`}
                >
                  {usuario.activo ? 'Activo' : 'Inactivo'}
                </button>
              </td>
              <td className="py-2 px-4 border space-x-2">
                <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDelete(usuario.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};