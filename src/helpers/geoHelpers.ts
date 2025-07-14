import { Geometry, Feature } from 'geojson';
import * as turf from '@turf/turf';

/** Returns area in m² (rounded). */
export function calcArea(geometry: Geometry): number {
  const feat = turf.feature(geometry) as Feature;
  return Math.round(turf.area(feat));
}

/** Returns perimeter in m (rounded). Assumes a Polygon’s first ring. */
export function calcPerimeter(geometry: Geometry): number {
  if (geometry.type !== 'Polygon') return 0;
  const outer = (geometry.coordinates as number[][][])[0];
  const line = turf.lineString(outer);
  return Math.round(turf.length(line, { units: 'meters' }));
}
