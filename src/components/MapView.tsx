import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import React, { useEffect, useRef } from 'react';
import Map, { NavigationControl, FullscreenControl, type MapRef } from 'react-map-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { calcArea, calcPerimeter } from '../helpers/geoHelpers';
import { useZones } from '../context/ZonesContext';
import './MapView.css';

export default function MapView() {
  const { zones, addZone, updateZone, deleteZone, drawRef, mapRef } = useZones();
  const firstLoad = useRef(true);

  const handleLoad = ({ target: map }: any) => {
    if (drawRef.current) return;
    mapRef.current = map;

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: { polygon: true, trash: true },
      userProperties: true,
      styles: [
        // ───────────── Inactive polygon fill ─────────────
        {
          id: 'gl-draw-polygon-fill-inactive',
          type: 'fill',
          filter: ['all',
            ['==', 'active', false],
            ['==', '$type', 'Polygon'],
            ['!=', 'mode', 'static']
          ],
          paint: {
            'fill-color': '#3bb2d0',
            'fill-outline-color': '#3bb2d0',
            'fill-opacity': 0.1
          }
        },
        // ───────────── Active polygon fill ─────────────
        {
          id: 'gl-draw-polygon-fill-active',
          type: 'fill',
          filter: ['all',
            ['==', 'active', true],
            ['==', '$type', 'Polygon']
          ],
          paint: {
            'fill-color': '#fbb03b',
            'fill-outline-color': '#fbb03b',
            'fill-opacity': 0.1
          }
        },
        // ───────────── Inactive polygon stroke ─────────────
        {
          id: 'gl-draw-polygon-stroke-inactive',
          type: 'line',
          filter: ['all',
            ['==', 'active', false],
            ['==', '$type', 'Polygon'],
            ['!=', 'mode', 'static']
          ],
          layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: {
            'line-color': '#3bb2d0',
            'line-width': 2
          }
        },
        // ───────────── Active polygon stroke ─────────────
        {
          id: 'gl-draw-polygon-stroke-active',
          type: 'line',
          filter: ['all',
            ['==', 'active', true],
            ['==', '$type', 'Polygon']
          ],
          layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: {
            'line-color': '#fbb03b',
            'line-dasharray': [0.2, 2],
            'line-width': 2
          }
        },
        // ───────────── Midpoint handles ─────────────
        {
          id: 'gl-draw-polygon-midpoint',
          type: 'circle',
          filter: ['all',
            ['==', '$type', 'Point'],
            ['==', 'meta', 'midpoint']
          ],
          paint: {
            'circle-radius': 3,
            'circle-color': '#fbb03b'
          }
        },
        // ───────────── Vertex strokes ─────────────
        {
          id: 'gl-draw-polygon-and-line-vertex-stroke-inactive',
          type: 'circle',
          filter: ['all',
            ['==', 'meta', 'vertex'],
            ['==', '$type', 'Point'],
            ['!=', 'mode', 'static']
          ],
          paint: {
            'circle-radius': 5,
            'circle-color': '#fff'
          }
        },
        {
          id: 'gl-draw-polygon-and-line-vertex-inactive',
          type: 'circle',
          filter: ['all',
            ['==', 'meta', 'vertex'],
            ['==', '$type', 'Point'],
            ['!=', 'mode', 'static']
          ],
          paint: {
            'circle-radius': 3,
            'circle-color': '#fbb03b'
          }
        },
        // ───────────── Your custom color layers ─────────────
        {
          id: 'custom-fill',
          type: 'fill',
          filter: ['all', ['==', '$type', 'Polygon']],
          paint: {
            'fill-color': ['get', 'user_color'],
            'fill-opacity': 0.3
          }
        },
        {
          id: 'custom-line',
          type: 'line',
          filter: ['all', ['==', '$type', 'Polygon']],
          paint: {
            'line-color': ['get', 'user_color'],
            'line-width': 2
          }
        }
      ]
    });


    map.addControl(draw, 'top-left');
    drawRef.current = draw;

    // inject existing zones once
    if (firstLoad.current && zones.length) {
      zones.forEach(z => {
        draw.add({
          type: 'Feature', id: String(z.id),
          properties: { color: z.color },
          geometry: z.feature.geometry
        });
      });
      firstLoad.current = false;
    }

    // create
    map.on('draw.create', (e: any) => {
      addZone(e.features[0].geometry);
    });

    // update
    map.on('draw.update', (e: any) => {
      const f = e.features[0];
      const id = Number(f.id);
      const geom = f.geometry;
      updateZone(id, {
        feature: { ...f, geometry: geom },
        area: `${calcArea(geom)} m²`,
        parameter: `${calcPerimeter(geom)} m`
      });
      drawRef.current.changeMode('simple_select');
      mapRef.current.dragPan.enable();
    });

    // delete
    map.on('draw.delete', (e: any) => {
      deleteZone(Number(e.features[0].id));
    });
  };

  // sync react state back into draw
  useEffect(() => {
    const draw = drawRef.current;
    if (!draw) return;
    draw.deleteAll();
    if (!zones.length) return;

    const fc = {
      type: 'FeatureCollection',
      features: zones.map(z => ({
        ...z.feature,
        properties: { color: z.color }
      }))
    };

    draw.add(fc as any);
  }, [zones]);

  return (
    <div className="mapContainer">
      <Map
        initialViewState={{ latitude: 24.7136, longitude: 46.6753, zoom: 12 }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        onLoad={handleLoad}
        ref={mapRef}
      >
        <NavigationControl position="top-right" />
        <FullscreenControl position="top-right" />
      </Map>
    </div>
  );
}