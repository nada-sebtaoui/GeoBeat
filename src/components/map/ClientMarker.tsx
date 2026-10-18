import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Client } from '../../types';

interface ClientMarkerProps {
  client: Client;
  onClick: () => void;
}

const createClientIcon = (status: Client['status'], visitOrder: number | null, priority: Client['priority']) => {
  const orderText = visitOrder !== null ? String(visitOrder) : '?';

  return L.divIcon({
    className: '',
    html: `
      <div class="client-marker-wrapper">
        <div class="client-marker-pin ${status}">
          ${orderText}
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const priorityLabel: Record<Client['priority'], string> = {
  high: 'Haute',
  medium: 'Moyenne',
  low: 'Basse',
};

const statusLabel: Record<Client['status'], string> = {
  pending: 'En attente',
  visited: 'Visité',
  skipped: 'Ignoré',
};

export const ClientMarker: React.FC<ClientMarkerProps> = ({ client, onClick }) => {
  return (
    <Marker
      position={[client.lat, client.lng]}
      icon={createClientIcon(client.status, client.visitOrder, client.priority)}
      eventHandlers={{ click: onClick }}
    >
      <Popup>
        <div style={{ padding: '12px 14px', minWidth: '180px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9', fontFamily: 'IBM Plex Mono, monospace' }}>
              {client.name}
            </span>
            {client.visitOrder !== null && (
              <span style={{
                background: '#3b82f6',
                color: '#fff',
                borderRadius: '4px',
                padding: '1px 7px',
                fontSize: '11px',
                fontWeight: 700,
                fontFamily: 'IBM Plex Mono, monospace',
              }}>
                #{client.visitOrder}
              </span>
            )}
          </div>
          <p style={{ fontSize: '11px', color: '#94a3b8', margin: '0 0 4px', fontFamily: 'IBM Plex Mono, monospace' }}>
            {client.company}
          </p>
          <p style={{ fontSize: '10px', color: '#475569', margin: '0 0 8px', fontFamily: 'IBM Plex Mono, monospace' }}>
            {client.address}
          </p>
          <div style={{ display: 'flex', gap: '6px' }}>
            <span style={{
              fontSize: '9px',
              padding: '2px 6px',
              borderRadius: '3px',
              background: client.priority === 'high' ? 'rgba(239,68,68,0.15)' : client.priority === 'medium' ? 'rgba(234,179,8,0.15)' : 'rgba(34,197,94,0.15)',
              color: client.priority === 'high' ? '#f87171' : client.priority === 'medium' ? '#facc15' : '#4ade80',
              fontWeight: 600,
              fontFamily: 'IBM Plex Mono, monospace',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}>
              {priorityLabel[client.priority]}
            </span>
            <span style={{
              fontSize: '9px',
              padding: '2px 6px',
              borderRadius: '3px',
              background: client.status === 'visited' ? 'rgba(34,197,94,0.15)' : client.status === 'skipped' ? 'rgba(71,85,105,0.15)' : 'rgba(249,115,22,0.15)',
              color: client.status === 'visited' ? '#4ade80' : client.status === 'skipped' ? '#64748b' : '#fb923c',
              fontWeight: 600,
              fontFamily: 'IBM Plex Mono, monospace',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}>
              {statusLabel[client.status]}
            </span>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};
