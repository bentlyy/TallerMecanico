import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createMecanico, updateMecanico } from '../../api/mecanicoApi';
import { getUsuarios } from '../../api/usuarioApi';

interface MecanicoFormProps {
  initialData?: any;
  onSuccess: () => void;
}

export const MecanicoForm = ({ initialData, onSuccess }: MecanicoFormProps) => {
  const { register, handleSubmit } = useForm({
    defaultValues: initialData || {}
  });
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await getUsuarios();
        setUsuarios(response.data);
      } catch (err) {
        console.error('Error fetching usuarios:', err);
      }
    };
    fetchUsuarios();
  }, []);

  const onSubmit = async (data: any) => {
    try {
      if (initialData?.id) {
        await updateMecanico(initialData.id, data);
      } else {
        await createMecanico(data.usuarioId, data.especialidad);
      }
      onSuccess();
    } catch (err) {
      setError('Error al guardar el mecánico');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <div className="text-red-500">{error}</div>}
      
      <div>
        <label>Usuario</label>
        <select {...register('usuarioId', { required: true })} className="w-full p-2 border rounded">
          <option value="">Seleccionar usuario</option>
          {usuarios.map(usuario => (
            <option key={usuario.id} value={usuario.id}>
              {usuario.nombre} ({usuario.email})
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label>Especialidad</label>
        <input {...register('especialidad')} className="w-full p-2 border rounded" />
      </div>
      
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        {initialData?.id ? 'Actualizar' : 'Crear'} Mecánico
      </button>
    </form>
  );
};