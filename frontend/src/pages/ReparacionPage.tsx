// frontend/src/pages/ReparacionPage.tsx
import React, { useState } from 'react';
import { Paper } from '@mui/material';
import ReparacionList from '../components/Reparacion/ReparacionList';
import ReparacionForm from '../components/Reparacion/ReparacionForm';
import { Reparacion } from '../types';

const ReparacionPage: React.FC = () => {
  const [selected, setSelected] = useState<Reparacion | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleEdit = (r: Reparacion) => {
    setSelected(r);
    setShowForm(true);
  };
  const handleCreate = () => {
    setSelected(null);
    setShowForm(true);
  };
  const handleSuccess = () => {
    setShowForm(false);
  };

  return (
    <Paper sx={{ p: 3 }}>
      {showForm ? (
        <ReparacionForm reparacionId={selected?.id} onSuccess={handleSuccess} onCancel={() => setShowForm(false)} />
      ) : (
        <ReparacionList onEdit={handleEdit} onCreate={handleCreate} />
      )}
    </Paper>
  );
};

export default ReparacionPage;
