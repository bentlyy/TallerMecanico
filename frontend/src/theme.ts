import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0d47a1',
      light: '#5472d3',
      dark: '#002171',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#e65100',
      light: '#ff833a',
      dark: '#ac1900',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f4f6f8',
      paper: '#ffffff',
    },
    success: {
      main: '#2e7d32',
    },
    error: {
      main: '#d32f2f',
    },
    warning: {
      main: '#ed6c02',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, borderRadius: 8 },
        containedPrimary: { boxShadow: '0 2px 8px rgba(13, 71, 161, 0.3)' },
        containedSecondary: { boxShadow: '0 2px 8px rgba(230, 81, 0, 0.3)' },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { boxShadow: '0 2px 12px rgba(0,0,0,0.08)', borderRadius: 12 },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined', size: 'small' },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            fontWeight: 700,
            backgroundColor: '#f4f6f8',
          },
        },
      },
    },
  },
});

export default theme;
