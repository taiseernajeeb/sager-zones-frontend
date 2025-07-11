import React, { useState } from 'react';
import './ZonesPage.css';

import SearchIcon        from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import EditIcon          from '@mui/icons-material/Edit';
import DataUsageIcon     from '@mui/icons-material/DataUsage';
import { Paper, Button, TableContainer, Pagination } from '@mui/material';

import sagerLogo  from '../assets/sager-logo.png';
import ZonesTable from '../components/ZonesTable';
import MapView    from '../components/MapView';

import { useZones, Zone } from '../context/ZonesContext';

export default function ZonesPage() {
  const { zones, updateZone, deleteZone } = useZones();

  const [page, setPage] = useState<number>(1);
  const rowsPerPage = 5;
  const pageCount = Math.max(1, Math.ceil(zones.length / rowsPerPage));
  const paged: Zone[] = zones.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );
  const handleChangePage = (_: any, value: number) => setPage(value);

  const handleSaveZones = () => {
    localStorage.setItem('zones', JSON.stringify(zones));
    alert('Zones saved!');
  };

  return (
    <div className="zonesPage">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebarHeader">
          <img src={sagerLogo} alt="SAGER Logo" className="logoImg" />
        </div>
        <nav className="sidebarNav">
          <ul>
            <li>Dashboard</li>
            <li>Inventory</li>
            <li>Clients</li>
            <li>Pilots</li>
            <li>Projects</li>
            <li className="active">Sites</li>
            <li>Missions</li>
            <li>Flights</li>
            <li>Cloud</li>
          </ul>
        </nav>
        <div className="sidebarFooter">
          <button className="btnPrimary">Request a Mission</button>
          <button className="btnSecondary">Create a Project</button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="contentArea">
        {/* HEADER */}
        <div className="headerArea">
          <header className="topBar">
            <div className="breadcrumb">
              Site &gt; <strong>Jabri site</strong>
            </div>
            <div className="topBarControls">
              <div className="searchBox">
                <SearchIcon fontSize="small" />
                <input type="text" placeholder="Search..." />
              </div>
              <div className="topBarText">09:38 PM (GMT+3)</div>
              <div className="topBarText">🌤️ 28 °C</div>
              <button className="iconBtn">
                <NotificationsIcon />
              </button>
              <button className="iconBtn">
                <EditIcon />
              </button>
              <button className="iconBtn">
                <DataUsageIcon />
              </button>
              <img
                src="https://i.pravatar.cc/32"
                alt="Avatar"
                className="avatar"
              />
            </div>
          </header>
          <ul className="subNav">
            <li>Site Main Information</li>
            <li>Dashboard</li>
            <li>Media</li>
            <li>Documentation</li>
            <li className="active">Zones</li>
            <li>Assets</li>
            <li>Integration Hub</li>
            <li>Cloud</li>
          </ul>
        </div>

        {/* BODY */}
        <div className="body">
          {/* TABLE PANEL */}
          <Paper elevation={2} className="paperPanel tablePanel">
            <div className="tableHeader">
              <h2>Zones</h2>
              <Button
                variant="contained"
                color="error"
                onClick={handleSaveZones}
              >
                Save
              </Button>
            </div>
            <TableContainer>
              <ZonesTable zones={paged} />
            </TableContainer>
            <div className="tableFooter">
              <Pagination
                count={pageCount}
                page={page}
                onChange={handleChangePage}
                size="small"
              />
            </div>
          </Paper>

          {/* MAP PANEL */}
          <Paper elevation={2} className="paperPanel mapPanel">
            <MapView />
          </Paper>
        </div>
      </div>
    </div>
  );
}
