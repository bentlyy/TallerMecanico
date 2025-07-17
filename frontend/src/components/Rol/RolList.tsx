import { useEffect, useState } from 'react';
import { getAllRoles, deleteRol } from '../../api/rolApi';

export const RolList = () => {
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRoles = async () => {
    try {
      const response = await getAllRoles();
      setRoles(response.data);
    } catch (err) {
      console.error('Error fetching roles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este rol?')) {
      await deleteRol(id);
      fetchRoles();
    }
  };

  if (loading) return <div>Cargando roles...</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Nombre</th>
            <th className="py-2 px-4 border">Permisos</th>
            <th className="py-2 px-4 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {roles.map(rol => (
            <tr key={rol.id}>
              <td className="py-2 px-4 border">{rol.nombre}</td>
              <td className="py-2 px-4 border">
                {Object.keys(rol.permisos).filter(p => rol.permisos[p]).join(', ')}
              </td>
              <td className="py-2 px-4 border">
                <button 
                  className="bg-red-500 text-white px-2 py-1 rounded" 
                  onClick={() => handleDelete(rol.id)}
                >
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