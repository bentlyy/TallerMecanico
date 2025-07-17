import { useForm } from 'react-hook-form';
import { createRol, updateRol } from '../../api/rolApi';

interface RolFormProps {
  initialData?: any;
  onSuccess: () => void;
}

export const RolForm = ({ initialData, onSuccess }: RolFormProps) => {
  const { register, handleSubmit } = useForm({
    defaultValues: initialData || { permisos: {} }
  });
  const [error, setError] = useState('');

  const permisosDisponibles = [
    'usuarios.manage',
    'clientes.manage',
    'vehiculos.manage',
    'reparaciones.manage',
    'facturas.manage'
  ];

  const onSubmit = async (data: any) => {
    try {
      if (initialData?.id) {
        await updateRol(initialData.id, data);
      } else {
        await createRol(data);
      }
      onSuccess();
    } catch (err) {
      setError('Error al guardar el rol');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <div className="text-red-500">{error}</div>}
      
      <div>
        <label>Nombre del Rol</label>
        <input {...register('nombre', { required: true })} className="w-full p-2 border rounded" />
      </div>
      
      <div>
        <label>Permisos</label>
        <div className="grid grid-cols-2 gap-2">
          {permisosDisponibles.map(permiso => (
            <div key={permiso} className="flex items-center">
              <input
                type="checkbox"
                id={permiso}
                {...register(`permisos.${permiso}`)}
                className="mr-2"
              />
              <label htmlFor={permiso}>{permiso}</label>
            </div>
          ))}
        </div>
      </div>
      
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        {initialData?.id ? 'Actualizar' : 'Crear'} Rol
      </button>
    </form>
  );
};