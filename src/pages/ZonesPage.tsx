import React, { useState, lazy, Suspense } from 'react';
import './ZonesPage.css';

import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import {
  Paper,
  Button,
  TableContainer,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
  useMediaQuery,
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';

import sagerLogo from '../assets/sager-logo.png';
import ZonesTable from '../components/ZonesTable';
const MapView = lazy(() => import('../components/MapView'));
import { useZones, Zone } from '../context/ZonesContext';

export default function ZonesPage() {
  const envName = import.meta.env.VITE_APP_ENV_NAME || '';
  const { zones } = useZones();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const pageCount = Math.max(1, Math.ceil(zones.length / rowsPerPage));
  const paged: Zone[] = zones.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const handleChangePage = (_: any, value: number) => setPage(value);
  const handleSaveZones = () => {
    localStorage.setItem('zones', JSON.stringify(zones));
    alert('Zones saved!');
  };
  const handleRowsPerPageChange = (e: any) => {
    setRowsPerPage(parseInt(e.target.value));
    setPage(1);
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleDrawer = () => setMobileOpen(o => !o);

  const sidebar = (
    <aside className="sidebar">
      <nav className="sidebarNav">
        <ul>
          {['Dashboard','Inventory','Clients','Pilots','Projects','Sites','Missions','Flights','Cloud'].map(item => (
            <li key={item} className={item === 'Sites' ? 'active' : ''}>{item}</li>
          ))}
        </ul>
      </nav>
      <div>
        <button className="btnPrimary"><FlightTakeoffIcon /> Request a Mission</button>
        <button className="btnSecondary"><AddCircleIcon /> Create a Project</button>
      </div>
      <div className="sidebarFooter">
        <div className="brand">SagerSpace™ Dashboard {envName && `(${envName})`}</div>
        <div>© {new Date().getFullYear()} All Rights Reserved</div>
        <div className="links">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms & Conditions</a>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="zonesPage">
      {isMobile && (
        <AppBar position="fixed" color="default" elevation={1}>
          <Toolbar>
            <IconButton edge="start" onClick={toggleDrawer}><MenuIcon /></IconButton>
            <img src={sagerLogo} alt="Logo" className="logoImg" style={{ height: 32, marginLeft: 8 }} />
          </Toolbar>
        </AppBar>
      )}
      {/* Drawer is rendered ALWAYS for mobile, never for desktop */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={toggleDrawer}
        ModalProps={{ keepMounted: true }}
        // Ensures sidebar style is visible on mobile (see CSS below)
        PaperProps={{ className: 'mobileSidebarDrawer' }}
      >
        {sidebar}
      </Drawer>
      {!isMobile && sidebar}

      <div className="contentArea">
        {!isMobile && (
          <header className="headerArea">
            <div className="headerLeft">
              <img src={sagerLogo} alt="Logo" className="logo" />
              <div className="searchBox">
                <SearchIcon fontSize="small" />
                <input type="text" placeholder="Search..." />
              </div>
            </div>
            <div className="headerRight">
              <div className="statusBlock">
                <span>09:38 PM</span>
                <span>(GMT+3)</span>
                <span>🌤️ 28°C</span>
                <span>19°C</span>
              </div>
              <button className="iconBtn bell"><NotificationsIcon /><span className="badge" /></button>
              <div className="avatar"><img src="https://i.pravatar.cc/32" alt="Avatar" /></div>
            </div>
          </header>
        )}

        {!isMobile && (
          <div className="actionNavBar">
            <div className="boxedActions">
              <Button variant="outlined" size="small" startIcon={<EditIcon />}>Edit</Button>
              <Button variant="contained" color="error" size="small" startIcon={<DataUsageIcon />}>Data Product</Button>
            </div>
          </div>
        )}

        {!isMobile && (
          <ul className="subNav">
            {['Site Main Information','Dashboard','Media','Documentation','Zones','Assets','Integration Hub','Cloud'].map(tab => (
              <li key={tab} className={tab === 'Zones' ? 'active' : ''}>{tab}</li>
            ))}
          </ul>
        )}

        <div className="body">
          <Paper elevation={2} className="paperPanel tablePanel">
            <div className="tableHeader">
              <h2>Zones</h2>
              <Button variant="contained" color="error" onClick={handleSaveZones}>Save</Button>
            </div>
            <TableContainer>
              <ZonesTable zones={paged} />
            </TableContainer>
            <div className="tableFooter">
              <FormControl size="small">
                <InputLabel id="rows-label">Rows</InputLabel>
                <Select labelId="rows-label" value={rowsPerPage} label="Rows" onChange={handleRowsPerPageChange}>
                  {[1, 5, 10].map(n => <MenuItem key={n} value={n}>{n}</MenuItem>)}
                </Select>
              </FormControl>
              <Pagination count={pageCount} page={page} onChange={handleChangePage} size="small" />
            </div>
          </Paper>
          <Paper elevation={2} className="paperPanel mapPanel">
            <Suspense fallback={<div>Loading map…</div>}><MapView /></Suspense>
          </Paper>
        </div>
      </div>
    </div>
  );
}
