import { StrictMode } from 'react';
import { createRoot }  from 'react-dom/client';
import './index.css';
import App             from './App.jsx';
import { ZonesProvider } from './context/ZonesContext';

/// <- NEW IMPORTS:
import theme      from './theme';
import { ThemeProvider, CssBaseline } from '@mui/material';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />      {/* resets browser styles & applies theme background */}
      <ZonesProvider>
        <App />
      </ZonesProvider>
    </ThemeProvider>
  </StrictMode>,
);
