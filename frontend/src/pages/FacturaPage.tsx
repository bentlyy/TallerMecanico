import React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import FacturaList from '../components/Factura/FacturaList';
import FacturaForm from '../components/Factura/FacturaForm';

const FacturaPage: React.FC = () => {
  return (
    <Container sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <FacturaForm />
        </Grid>
        <Grid item xs={12} md={6}>
          <FacturaList />
        </Grid>
      </Grid>
    </Container>
  );
};

export default FacturaPage;
