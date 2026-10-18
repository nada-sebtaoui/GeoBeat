import React from 'react';
import { Polyline } from 'react-leaflet';

interface RoutePolylineProps {
  coordinates: [number, number][];
}

export const RoutePolyline: React.FC<RoutePolylineProps> = ({ coordinates }) => {
  if (coordinates.length === 0) return null;

  const latLngCoordinates: [number, number][] = coordinates.map(([lng, lat]) => [lat, lng]);

  return (
    <>
      {/* Shadow line for depth */}
      <Polyline
        positions={latLngCoordinates}
        pathOptions={{
          color: '#1e3a5f',
          weight: 8,
          opacity: 0.5,
        }}
      />
      {/* Main route line */}
      <Polyline
        positions={latLngCoordinates}
        pathOptions={{
          color: '#3b82f6',
          weight: 3,
          opacity: 0.85,
          dashArray: '10 6',
        }}
      />
    </>
  );
};
