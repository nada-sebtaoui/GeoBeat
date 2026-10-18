import React from 'react';
import { useMap } from 'react-leaflet';
import { Crosshair } from 'lucide-react';
import { AgentPosition } from '../../types';

interface MapControlsProps {
  agentPosition: AgentPosition;
}

export const MapControls: React.FC<MapControlsProps> = ({ agentPosition }) => {
  const map = useMap();

  const recenterMap = () => {
    map.setView([agentPosition.lat, agentPosition.lng], 14, { animate: true });
  };

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '24px',
        right: '16px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        alignItems: 'flex-end',
      }}
    >
      {/* Coordinates overlay */}
      <div style={{
        background: 'rgba(13,20,36,0.92)',
        border: '0.5px solid #1e2d45',
        borderRadius: '6px',
        padding: '6px 10px',
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: '10px',
        color: '#475569',
        letterSpacing: '0.04em',
        backdropFilter: 'blur(4px)',
      }}>
        <span style={{ color: '#3b82f6', marginRight: '6px' }}>POS</span>
        {agentPosition.lat.toFixed(4)}° N · {agentPosition.lng.toFixed(4)}° E
      </div>

      {/* Recenter button */}
      <button
        onClick={recenterMap}
        style={{
          background: '#3b82f6',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          padding: '9px 14px',
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          boxShadow: '0 4px 16px rgba(59,130,246,0.3)',
          transition: 'background 0.15s, transform 0.1s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = '#2563eb')}
        onMouseLeave={e => (e.currentTarget.style.background = '#3b82f6')}
        onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.97)')}
        onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <Crosshair size={14} />
        Me recentrer
      </button>
    </div>
  );
};
