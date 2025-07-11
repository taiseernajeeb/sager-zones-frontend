import React, {
  createContext,
  useContext,
  useRef,
  useState,
  ReactNode
} from 'react';
import bbox from '@turf/bbox';
import { calcArea, calcPerimeter } from '../helpers/geoHelpers';
import { Feature, Geometry } from 'geojson';

export interface Zone {
  id: number;
  name: string;
  type: string;
  color: string;
  area: string;
  parameter: string;
  visible: boolean;
  feature: Feature;
}

interface ZonesContextValue {
  zones: Zone[];
  addZone(geometry: Geometry): void;
  updateZone(id: number, updates: Partial<Zone>): void;
  deleteZone(id: number): void;
  zoomToZone(geometry: Geometry): void;
  saveZones(): void;
  drawRef: React.MutableRefObject<any>;
  mapRef: React.MutableRefObject<any>;
}

const ZonesContext = createContext<ZonesContextValue | null>(null);

export const ZonesProvider = ({ children }: { children: ReactNode }) => {
  const nextId = useRef(1);
  const [zones, setZones] = useState<Zone[]>(() => {
    // load from storage on init
    try {
      const raw = localStorage.getItem('zones');
      if (raw) {
        const stored = JSON.parse(raw) as Zone[];
        if (stored.length) {
          nextId.current = Math.max(...stored.map(z => z.id)) + 1;
        }
        return stored;
      }
    } catch {
      // ignore parse errors
    }
    return [];
  });

  const drawRef = useRef<any>(null);
  const mapRef = useRef<any>(null);

  const addZone = (geometry: Geometry) => {
    const id = nextId.current++;
    const area = calcArea(geometry);
    const perimeter = calcPerimeter(geometry);
    const newZone: Zone = {
      id,
      name: `Zone ${id}`,
      type: 'Site layout',
      color: '#ff0000',
      area: `${area} m²`,
      parameter: `${perimeter} m`,
      visible: true,
      feature: { type: 'Feature', id: String(id), geometry, properties: {} }
    };
    setZones(z => [...z, newZone]);
  };

  const updateZone = (id: number, updates: Partial<Zone>) => {
    setZones(z => z.map(z0 => z0.id === id ? { ...z0, ...updates } : z0));
  };

  const deleteZone = (id: number) => {
    setZones(z => z.filter(z0 => z0.id !== id));
  };

  const zoomToZone = (geometry: Geometry) => {
    const map = mapRef.current;
    if (!map) return;
    const [minX, minY, maxX, maxY] = bbox(geometry);
    map.fitBounds([[minX, minY], [maxX, maxY]], { padding: 40, duration: 500 });
  };

  // manual save only; persistence no longer automatic
  const saveZones = () => {
    localStorage.setItem('zones', JSON.stringify(zones));
  };

  return (
    <ZonesContext.Provider
      value={{
        zones,
        addZone,
        updateZone,
        deleteZone,
        zoomToZone,
        saveZones,
        drawRef,
        mapRef
      }}
    >
      {children}
    </ZonesContext.Provider>
  );
};

export const useZones = () => {
  const ctx = useContext(ZonesContext);
  if (!ctx) throw new Error('useZones must be used inside ZonesProvider');
  return ctx;
};
