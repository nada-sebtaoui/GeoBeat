import React from 'react';
import { Priority, ClientStatus } from '../../types';

interface BadgeProps {
  type: 'priority' | 'status';
  value: Priority | ClientStatus;
}

const priorityConfig: Record<Priority, { label: string; bg: string; color: string; border: string }> = {
  high:   { label: 'Haute',   bg: 'rgba(239,68,68,0.12)',   color: '#f87171', border: 'rgba(239,68,68,0.25)' },
  medium: { label: 'Moyenne', bg: 'rgba(234,179,8,0.12)',   color: '#facc15', border: 'rgba(234,179,8,0.25)' },
  low:    { label: 'Basse',   bg: 'rgba(34,197,94,0.10)',   color: '#4ade80', border: 'rgba(34,197,94,0.20)' },
};

const statusConfig: Record<ClientStatus, { label: string; bg: string; color: string; border: string }> = {
  pending: { label: 'En attente', bg: 'rgba(249,115,22,0.12)', color: '#fb923c', border: 'rgba(249,115,22,0.25)' },
  visited: { label: 'Visité',     bg: 'rgba(34,197,94,0.10)',  color: '#4ade80', border: 'rgba(34,197,94,0.20)' },
  skipped: { label: 'Ignoré',     bg: 'rgba(71,85,105,0.12)',  color: '#64748b', border: 'rgba(71,85,105,0.25)' },
};

export const Badge: React.FC<BadgeProps> = ({ type, value }) => {
  const config = type === 'priority'
    ? priorityConfig[value as Priority]
    : statusConfig[value as ClientStatus];

  return (
    <span style={{
      background: config.bg,
      color: config.color,
      border: `0.5px solid ${config.border}`,
      borderRadius: '3px',
      padding: '2px 7px',
      fontSize: '9px',
      fontWeight: 600,
      fontFamily: 'IBM Plex Mono, monospace',
      letterSpacing: '0.07em',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
    }}>
      {config.label}
    </span>
  );
};
