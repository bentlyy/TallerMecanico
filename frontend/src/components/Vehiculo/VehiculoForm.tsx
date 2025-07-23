import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TextField, 
  MenuItem, 
  Button, 
  Box, 
  Typography, 
  CircularProgress, 
  Alert, 
  Snackbar,
  Select,
  FormControl,
  InputLabel,
  FormHelperText
} from '@mui/material';
import api from '../../api/axios';
import { getAllClientes } from '../../api/clienteApi';
import { Vehiculo } from '../../types';

interface Cliente {
  id: number;
  nombre: string;
}

const VehiculoForm: React.FC = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [clientesLoading, setClientesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    anio: '',
    patente: '',
    kilometraje: '',
    clienteId: ''
  });

  const [errors, setErrors] = useState({
    marca: '',
    modelo: '',
    anio: '',
    patente: '',
    kilometraje: '',
    clienteId: ''
  });

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        setClientesLoading(true);
        const response = await getAllClientes();
        setClientes(response.data);
      } catch (err) {
        setError('Error al cargar la lista de clientes');
        console.error('Error fetching clientes:', err);
      } finally {
        setClientesLoading(false);
      }
    };

    fetchClientes();
  }, []);

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      marca: '',
      modelo: '',
      anio: '',
      patente: '',
      kilometraje: '',
      clienteId: ''
    };

    if (!formData.marca.trim()) {
      newErrors.marca = 'La marca es requerida';
      valid = false;
    }

    if (!formData.modelo.trim()) {
      newErrors.modelo = 'El modelo es requerido';
      valid = false;
    }

    if (!formData.anio || isNaN(parseInt(formData.anio))) {
      newErrors.anio = 'Año inválido';
      valid = false;
    } else if (parseInt(formData.anio) < 1900 || parseInt(formData.anio) > new Date().getFullYear() + 1) {
      newErrors.anio = 'Año fuera de rango';
      valid = false;
    }

    if (!formData.patente.trim()) {
      newErrors.patente = 'La patente es requerida';
      valid = false;
    }

    if (!formData.kilometraje || isNaN(parseInt(formData.kilometraje))) {
      newErrors.kilometraje = 'Kilometraje inválido';
      valid = false;
    } else if (parseInt(formData.kilometraje) < 0) {
      newErrors.kilometraje = 'Kilometraje no puede ser negativo';
      valid = false;
    }

    if (!formData.clienteId) {
      newErrors.clienteId = 'Debe seleccionar un cliente';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors.clienteId) {
      setErrors(prev => ({
        ...prev,
        clienteId: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const payload = {
        marca: formData.marca.trim(),
        modelo: formData.modelo.trim(),
        anio: parseInt(formData.anio),
        patente: formData.patente.trim(),
        kilometraje: parseInt(formData.kilometraje),
        clienteId: parseInt(formData.clienteId)
      };

      await api.post('/vehiculos', payload);
      
      setSuccess(true);
      setFormData({
        marca: '',
        modelo: '',
        anio: '',
        patente: '',
        kilometraje: '',
        clienteId: ''
      });
      
      setTimeout(() => navigate('/vehiculos'), 1500);
    } catch (err: any) {
      console.error('Error creating vehiculo:', err);
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          'Error al crear el vehículo';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Crear Nuevo Vehículo
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <TextField
        name="marca"
        label="Marca"
        value={formData.marca}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
        required
        error={!!errors.marca}
        helperText={errors.marca}
      />
      
      <TextField
        name="modelo"
        label="Modelo"
        value={formData.modelo}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
        required
        error={!!errors.modelo}
        helperText={errors.modelo}
      />
      
      <TextField
        name="anio"
        label="Año"
        type="number"
        value={formData.anio}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
        required
        error={!!errors.anio}
        helperText={errors.anio}
        inputProps={{
          min: 1900,
          max: new Date().getFullYear() + 1
        }}
      />
      
      <TextField
        name="patente"
        label="Patente"
        value={formData.patente}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
        required
        error={!!errors.patente}
        helperText={errors.patente}
      />
      
      <TextField
        name="kilometraje"
        label="Kilometraje"
        type="number"
        value={formData.kilometraje}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
        required
        error={!!errors.kilometraje}
        helperText={errors.kilometraje}
        inputProps={{
          min: 0
        }}
      />
      
      {/* Solución para el Select */}
      <FormControl fullWidth margin="normal" error={!!errors.clienteId} required>
        <InputLabel>Cliente</InputLabel>
        <Select
          name="clienteId"
          value={formData.clienteId}
          onChange={handleSelectChange}
          disabled={clientesLoading}
          label="Cliente"
        >
          <MenuItem value="">
            <em>Seleccione un cliente</em>
          </MenuItem>
          {clientes.map((cliente) => (
            <MenuItem key={cliente.id} value={cliente.id}>
              {cliente.nombre}
            </MenuItem>
          ))}
        </Select>
        {errors.clienteId && <FormHelperText>{errors.clienteId}</FormHelperText>}
      </FormControl>
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/vehiculos')}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading || clientesLoading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Creando...' : 'Crear Vehículo'}
        </Button>
      </Box>
      
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message="Vehículo creado exitosamente"
      />
    </Box>
  );
};

export default VehiculoForm;