import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import ConfirmDialog from './ConfirmDialog';

const theme = createTheme();

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <ThemeProvider theme={theme}>
      <BrowserRouter>{ui}</BrowserRouter>
    </ThemeProvider>,
  );
}

describe('ConfirmDialog component', () => {
  const defaultProps = {
    open: true,
    title: 'Confirmar eliminación',
    message: '¿Estás seguro de eliminar este registro?',
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
  };

  it('debe mostrar el título y mensaje', () => {
    renderWithProviders(<ConfirmDialog {...defaultProps} />);
    expect(screen.getByText('Confirmar eliminación')).toBeInTheDocument();
    expect(screen.getByText('¿Estás seguro de eliminar este registro?')).toBeInTheDocument();
  });

  it('debe mostrar botones de acción', () => {
    renderWithProviders(<ConfirmDialog {...defaultProps} />);
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
    expect(screen.getByText('Eliminar')).toBeInTheDocument();
  });

  it('no debe renderizarse cuando open es false', () => {
    renderWithProviders(<ConfirmDialog {...defaultProps} open={false} />);
    expect(screen.queryByText('Confirmar eliminación')).not.toBeInTheDocument();
  });
});
