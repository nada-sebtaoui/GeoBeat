import React from 'react';
import { Marker } from 'react-leaflet';
import L from 'leaflet';
import { AgentPosition } from '../../types';

interface AgentMarkerProps {
  position: AgentPosition;
}

const agentIcon = L.divIcon({
  className: '',
  html: `
    <div class="agent-marker-wrapper">
      <div class="agent-pulse-ring"></div>
      <div class="agent-pulse-ring-2"></div>
      <div class="agent-core">
        <div class="agent-core-dot"></div>
      </div>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

export const AgentMarker: React.FC<AgentMarkerProps> = ({ position }) => {
  return (
    <Marker
      position={[position.lat, position.lng]}
      icon={agentIcon}
      zIndexOffset={1000}
    />
  );
};
