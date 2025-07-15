import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ff0f3d',     // Figma “SAGER red”
    },
    background: {
      default: '#f0f2f5',   // page background
      paper: '#fff',        // card & panel background
    },
    text: {
      primary: '#333',
      secondary: '#666',
    },
    error: {
      main: '#d32f2f',      // for DeleteIcon hover
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h2: {
      fontSize: '1.75rem',  // ~28px
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h5: {
      fontSize: '1.25rem',  // ~20px for section titles
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',     // ~16px default
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem', // ~14px for labels
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
});

export default theme;
