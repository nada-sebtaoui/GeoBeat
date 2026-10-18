import React, { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { AgentMarker } from './AgentMarker';
import { ClientMarker } from './ClientMarker';
import { RoutePolyline } from './RoutePolyline';
import { MapControls } from './MapControls';
import { useAgentStore } from '../../store/agentStore';
import { useClientStore } from '../../store/clientStore';
import { ClientDetailModal } from '../modals/ClientDetailModal';
import { Client } from '../../types';
import 'leaflet/dist/leaflet.css';

export const MapView: React.FC = () => {
  const { position } = useAgentStore();
  const { clients, routeCoordinates } = useClientStore();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  return (
    <>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <MapContainer
          center={[position.lat, position.lng]}
          zoom={13}
          style={{ width: '100%', height: '100%' }}
          zoomControl={true}
          zoomAnimation={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <AgentMarker position={position} />

          {clients.map((client: Client) => (
            <ClientMarker
              key={client.id}
              client={client}
              onClick={() => setSelectedClient(client)}
            />
          ))}

          <RoutePolyline coordinates={routeCoordinates} />
          <MapControls agentPosition={position} />
        </MapContainer>
      </div>

      {selectedClient && (
        <ClientDetailModal
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
        />
      )}
    </>
  );
};
