import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createUsuario, updateUsuario } from '../../api/usuarioApi';
import { getRoles } from '../../api/rolApi';

interface UsuarioFormProps {
  initialData?: any;
  onSuccess: () => void;
}

export const UsuarioForm = ({ initialData, onSuccess }: UsuarioFormProps) => {
  const { register, handleSubmit } = useForm({
    defaultValues: initialData || {}
  });
  const [roles, setRoles] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await getRoles();
        setRoles(response.data);
      } catch (err) {
        console.error('Error fetching roles:', err);
      }
    };
    fetchRoles();
  }, []);

  const onSubmit = async (data: any) => {
    try {
      if (initialData?.id) {
        await updateUsuario(initialData.id, data);
      } else {
        await createUsuario(data);
      }
      onSuccess();
    } catch (err) {
      setError('Error al guardar el usuario');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <div className="text-red-500">{error}</div>}
      
      <div>
        <label>Nombre</label>
        <input {...register('nombre', { required: true })} className="w-full p-2 border rounded" />
      </div>
      
      <div>
        <label>Email</label>
        <input {...register('email', { required: true })} type="email" className="w-full p-2 border rounded" />
      </div>
      
      <div>
        <label>Contraseña</label>
        <input {...register('password', { required: !initialData?.id })} type="password" className="w-full p-2 border rounded" />
      </div>
      
      <div>
        <label>Rol</label>
        <select {...register('rolId', { required: true })} className="w-full p-2 border rounded">
          {roles.map(rol => (
            <option key={rol.id} value={rol.id}>{rol.nombre}</option>
          ))}
        </select>
      </div>
      
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        {initialData?.id ? 'Actualizar' : 'Crear'} Usuario
      </button>
    </form>
  );
};