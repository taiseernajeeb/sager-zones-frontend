import React, { FC } from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Select,
  MenuItem,
  TextField,
  Card,
  CardContent,
  Typography,
  useMediaQuery,
  useTheme,
  Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useZones, Zone } from '../context/ZonesContext';

interface ZonesTableProps {
  zones: Zone[];
}

const ZonesTable: FC<ZonesTableProps> = ({ zones }) => {
  const { updateZone, deleteZone, zoomToZone, drawRef } = useZones();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // ← Add this:
  const pickerSize = isMobile ? 36 : 24;

  if (isMobile) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {zones.map(zone => (
          <Card
            key={zone.id}
            variant="outlined"
            sx={{ borderRadius: 2, boxShadow: 1 }}
          >
            <CardContent sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {/** Color Picker & Name **/}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  position: 'relative'  // for the absolute input overlay
                }}
              >
                {/** visible swatch **/}
                <Box
                  sx={{
                    width: pickerSize,
                    height: pickerSize,
                    borderRadius: '50%',
                    backgroundColor: zone.color,
                    border: '1px solid #ccc'
                  }}
                />
                {/** invisible native color input **/}
                <input
                  type="color"
                  value={zone.color}
                  onChange={e => {
                    const newColor = e.target.value;
                    updateZone(zone.id, { color: newColor });
                    if (drawRef.current) {
                      drawRef.current.setFeatureProperty(
                        String(zone.id),
                        'user_color',
                        newColor
                      );
                    }
                  }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: pickerSize,
                    height: pickerSize,
                    opacity: 0,
                    cursor: 'pointer',
                    touchAction: 'manipulation'
                  }}
                />
                {/** zone name input, padded to the right **/}
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  placeholder="Zone Name"
                  value={zone.name}
                  onChange={e => updateZone(zone.id, { name: e.target.value })}
                  sx={{ mb: 1, pl: `${pickerSize + 8}px` }}
                />
              </Box>

              {/** Type **/}
              <Select
                variant="outlined"
                size="small"
                fullWidth
                value={zone.type}
                onChange={e => updateZone(zone.id, { type: e.target.value })}
                sx={{ mb: 1 }}
              >
                <MenuItem value="Site layout">Site layout</MenuItem>
                <MenuItem value="Production">Production</MenuItem>
                <MenuItem value="Storage">Storage</MenuItem>
              </Select>

              {/** Metrics **/}
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                Area: {zone.area}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Perimeter: {zone.parameter}
              </Typography>

              {/** Actions **/}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <IconButton size="small" sx={{ p: 0.5 }} onClick={() => zoomToZone(zone.feature.geometry)}>
                  <VisibilityIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" sx={{ p: 0.5 }} onClick={() => deleteZone(zone.id)}>
                  <DeleteIcon fontSize="small" color="error" />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Color</TableCell>
          <TableCell>Zone Name</TableCell>
          <TableCell>Type</TableCell>
          <TableCell>Area</TableCell>
          <TableCell>Parameters</TableCell>
          <TableCell align="center">Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {zones.map(zone => (
          <TableRow key={zone.id}>
            <TableCell>
              <label style={{ position: 'relative', width: 24, height: 24, cursor: 'pointer', display: 'inline-block' }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: zone.color, border: '1px solid #ccc' }} />
                <input
                  type="color"
                  value={zone.color}
                  onChange={e => {
                    const newColor = e.target.value;
                    updateZone(zone.id, { color: newColor });
                    if (drawRef.current) {
                      drawRef.current.setFeatureProperty(String(zone.id), 'user_color', newColor);
                    }
                  }}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                />
              </label>
            </TableCell>
            <TableCell>
              <TextField variant="standard" fullWidth value={zone.name} onChange={e => updateZone(zone.id, { name: e.target.value })} />
            </TableCell>
            <TableCell>
              <Select variant="standard" fullWidth value={zone.type} onChange={e => updateZone(zone.id, { type: e.target.value })}>
                <MenuItem value="Site layout">Site layout</MenuItem>
                <MenuItem value="Production">Production</MenuItem>
                <MenuItem value="Storage">Storage</MenuItem>
              </Select>
            </TableCell>
            <TableCell>{zone.area}</TableCell>
            <TableCell>{zone.parameter}</TableCell>
            <TableCell align="center">
              <IconButton size="small" onClick={() => zoomToZone(zone.feature.geometry)}>
                <VisibilityIcon />
              </IconButton>
              <IconButton size="small" onClick={() => deleteZone(zone.id)}>
                <DeleteIcon color="error" />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ZonesTable;
