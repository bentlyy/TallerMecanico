import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material';
import Loading from './Loading';

const theme = createTheme();

function renderWithProviders(ui: React.ReactElement) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
}

describe('Loading component', () => {
  it('debe mostrar el mensaje por defecto', () => {
    renderWithProviders(<Loading />);
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('debe mostrar un mensaje personalizado', () => {
    renderWithProviders(<Loading message="Obteniendo datos..." />);
    expect(screen.getByText('Obteniendo datos...')).toBeInTheDocument();
  });

  it('debe mostrar el CircularProgress', () => {
    renderWithProviders(<Loading />);
    expect(document.querySelector('.MuiCircularProgress-root')).toBeInTheDocument();
  });
});
