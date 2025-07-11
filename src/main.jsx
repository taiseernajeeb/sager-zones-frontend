
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ZonesProvider } from './context/ZonesContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ZonesProvider>
      <App />
    </ZonesProvider>
  </StrictMode>,
)
