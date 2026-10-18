import React, { useState } from 'react';
import { Check, X, Eye } from 'lucide-react';
import { Client } from '../../types';
import { Badge } from '../ui/Badge';

interface ClientCardProps {
  client: Client;
  onMarkVisited: () => void;
  onMarkSkipped: () => void;
  onViewDetails: () => void;
}

export const ClientCard: React.FC<ClientCardProps> = ({
  client,
  onMarkVisited,
  onMarkSkipped,
  onViewDetails,
}) => {
  const [hovered, setHovered] = useState(false);

  const isVisited = client.status === 'visited';
  const isSkipped = client.status === 'skipped';

  const borderColor = isVisited
    ? 'rgba(34,197,94,0.2)'
    : isSkipped
    ? 'rgba(71,85,105,0.2)'
    : hovered
    ? 'rgba(59,130,246,0.4)'
    : '#1a2740';

  const bgColor = isVisited
    ? 'rgba(34,197,94,0.04)'
    : isSkipped
    ? 'rgba(71,85,105,0.04)'
    : '#0d1b2e';

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: bgColor,
        border: `0.5px solid ${borderColor}`,
        borderRadius: '7px',
        padding: '10px 12px',
        marginBottom: '6px',
        transition: 'border-color 0.15s, background 0.15s',
        animation: 'slide-in-left 0.18s ease-out',
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '7px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          {/* Order badge */}
          <div style={{
            width: '24px',
            height: '24px',
            background: isVisited ? 'rgba(34,197,94,0.15)' : isSkipped ? 'rgba(71,85,105,0.15)' : '#3b82f6',
            color: isVisited ? '#4ade80' : isSkipped ? '#64748b' : '#fff',
            borderRadius: '5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 700,
            flexShrink: 0,
            fontFamily: 'IBM Plex Mono, monospace',
          }}>
            {client.visitOrder !== null ? client.visitOrder : '—'}
          </div>

          <div>
            <div style={{
              fontSize: '12px',
              fontWeight: 600,
              color: isSkipped ? '#475569' : '#e2e8f0',
              fontFamily: 'IBM Plex Mono, monospace',
              letterSpacing: '0.02em',
              textDecoration: isSkipped ? 'line-through' : 'none',
            }}>
              {client.name}
            </div>
            <div style={{
              fontSize: '10px',
              color: '#475569',
              fontFamily: 'IBM Plex Mono, monospace',
              letterSpacing: '0.03em',
            }}>
              {client.company}
            </div>
          </div>
        </div>

        {/* Badges */}
        <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
          <Badge type="priority" value={client.priority} />
          <Badge type="status" value={client.status} />
        </div>
      </div>

      {/* Address */}
      <div style={{
        fontSize: '10px',
        color: '#334155',
        fontFamily: 'IBM Plex Mono, monospace',
        letterSpacing: '0.03em',
        marginBottom: '4px',
      }}>
        📍 {client.address}
      </div>

      {/* Phone */}
      <div style={{
        fontSize: '10px',
        color: '#334155',
        fontFamily: 'IBM Plex Mono, monospace',
        marginBottom: client.notes ? '8px' : '10px',
      }}>
        {client.phone}
      </div>

      {/* Notes */}
      {client.notes && (
        <div style={{
          fontSize: '10px',
          color: '#60a5fa',
          fontFamily: 'IBM Plex Mono, monospace',
          fontStyle: 'italic',
          borderLeft: '2px solid rgba(59,130,246,0.4)',
          paddingLeft: '8px',
          marginBottom: '10px',
          letterSpacing: '0.02em',
        }}>
          {client.notes}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '5px' }}>
        <ActionBtn
          onClick={onMarkVisited}
          disabled={isVisited}
          color="#22c55e"
          bg="rgba(34,197,94,0.08)"
          border="rgba(34,197,94,0.25)"
          icon={<Check size={12} />}
          label="Visité"
        />
        <ActionBtn
          onClick={onMarkSkipped}
          disabled={isSkipped}
          color="#64748b"
          bg="transparent"
          border="rgba(71,85,105,0.25)"
          icon={<X size={12} />}
          label="Ignorer"
        />
        <ActionBtn
          onClick={onViewDetails}
          disabled={false}
          color="#60a5fa"
          bg="rgba(59,130,246,0.06)"
          border="rgba(59,130,246,0.25)"
          icon={<Eye size={12} />}
          label="Voir"
        />
      </div>
    </div>
  );
};

interface ActionBtnProps {
  onClick: () => void;
  disabled: boolean;
  color: string;
  bg: string;
  border: string;
  icon: React.ReactNode;
  label: string;
}

const ActionBtn: React.FC<ActionBtnProps> = ({ onClick, disabled, color, bg, border, icon, label }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      flex: 1,
      background: bg,
      color: disabled ? 'rgba(71,85,105,0.5)' : color,
      border: `0.5px solid ${disabled ? 'rgba(71,85,105,0.15)' : border}`,
      borderRadius: '4px',
      padding: '4px 0',
      fontSize: '9px',
      fontFamily: 'IBM Plex Mono, monospace',
      fontWeight: 600,
      letterSpacing: '0.07em',
      textTransform: 'uppercase',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '4px',
      transition: 'filter 0.1s',
    }}
  >
    {icon}
    {label}
  </button>
);
