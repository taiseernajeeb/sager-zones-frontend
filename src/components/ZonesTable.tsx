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
  TextField
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useZones, Zone } from '../context/ZonesContext';

interface ZonesTableProps {
  zones: Zone[];
}

const ZonesTable: FC<ZonesTableProps> = ({ zones }) => {
  const { updateZone, deleteZone, zoomToZone, drawRef } = useZones();

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
            {/* Color Picker */}
            <TableCell>
              <label
                style={{
                  position: 'relative',
                  width: 24,
                  height: 24,
                  cursor: 'pointer',
                  display: 'inline-block'
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: zone.color,
                    border: '1px solid #ccc'
                  }}
                />
                <input
                  type="color"
                  value={zone.color}
                  onChange={e => {
                    const newColor = e.target.value;
                    // 1) update state
                    updateZone(zone.id, { color: newColor });
                    // 2) instantly recolor map feature
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
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer'
                  }}
                />
              </label>
            </TableCell>

            {/* Name */}
            <TableCell>
              <TextField
                variant="standard"
                fullWidth
                value={zone.name}
                onChange={e =>
                  updateZone(zone.id, { name: e.target.value })
                }
              />
            </TableCell>

            {/* Type */}
            <TableCell>
              <Select
                variant="standard"
                fullWidth
                value={zone.type}
                onChange={e =>
                  updateZone(zone.id, { type: e.target.value })
                }
              >
                <MenuItem value="Site layout">Site layout</MenuItem>
                <MenuItem value="Production">Production</MenuItem>
                <MenuItem value="Storage">Storage</MenuItem>
              </Select>
            </TableCell>

            {/* Metrics */}
            <TableCell>{zone.area}</TableCell>
            <TableCell>{zone.parameter}</TableCell>

            {/* Actions */}
            <TableCell align="center">
              <IconButton
                size="small"
                onClick={() => zoomToZone(zone.feature.geometry)}
              >
                <VisibilityIcon />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => deleteZone(zone.id)}
              >
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
