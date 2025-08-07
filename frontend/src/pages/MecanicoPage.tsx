import React, { useState } from 'react';
import MecanicoForm from '../components/Mecanico/MecanicoForm';
import MecanicoList from '../components/Mecanico/MecanicoList';
import { Mecanico } from '../types';
import { Paper } from '@mui/material';

const MecanicoPage: React.FC = () => {
  const [selected, setSelected] = useState<Mecanico | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleEdit = (mecanico: Mecanico) => {
    setSelected(mecanico);
    setShowForm(true);
  };

  const handleCreate = () => {
    setSelected(null);
    setShowForm(true);
  };

  const handleSave = () => {
    setShowForm(false);
  };

  return (
    <Paper sx={{ p: 3 }}>
      {showForm ? (
        <MecanicoForm mecanico={selected} onSave={handleSave} />
      ) : (
        <MecanicoList onEdit={handleEdit} onCreate={handleCreate} />
      )}
    </Paper>
  );
};

export default MecanicoPage;
