import React from 'react';
import { useClientStore } from '../../store/clientStore';
import { useClients } from '../../hooks/useClients';

export const RouteStats: React.FC = () => {
  const { totalDistance, totalDuration } = useClientStore();
  const { getStats } = useClients();
  const stats = getStats();

  const formatDistance = (m: number) => (m / 1000).toFixed(1);
  const formatDuration = (s: number) => Math.round(s / 60);

  const progressPct = stats.total > 0 ? Math.round((stats.visited / stats.total) * 100) : 0;

  return (
    <div style={{
      borderTop: '0.5px solid #1e2d45',
      padding: '14px 16px',
      background: '#0a0f1a',
    }}>
      {/* Title */}
      <div style={{
        fontSize: '9px',
        color: '#334155',
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        fontFamily: 'IBM Plex Mono, monospace',
        marginBottom: '10px',
      }}>
        Statistiques journée
      </div>

      {/* Stats grid */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
        <StatCell
          value={totalDistance > 0 ? formatDistance(totalDistance) : '—'}
          unit="km"
          color="#3b82f6"
        />
        <StatCell
          value={totalDuration > 0 ? String(formatDuration(totalDuration)) : '—'}
          unit="min"
          color="#22c55e"
        />
        <StatCell
          value={`${stats.visited}/${stats.total}`}
          unit="visités"
          color="#f97316"
        />
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: '6px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '9px',
          color: '#334155',
          fontFamily: 'IBM Plex Mono, monospace',
          marginBottom: '5px',
          letterSpacing: '0.06em',
        }}>
          <span>Progression</span>
          <span style={{ color: progressPct === 100 ? '#4ade80' : '#475569' }}>{progressPct}%</span>
        </div>
        <div style={{
          height: '3px',
          background: '#1a2740',
          borderRadius: '2px',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${progressPct}%`,
            background: progressPct === 100 ? '#22c55e' : '#3b82f6',
            borderRadius: '2px',
            transition: 'width 0.4s ease',
          }} />
        </div>
      </div>

      {/* Footer line */}
      <div style={{
        fontSize: '9px',
        color: '#1e2d45',
        fontFamily: 'IBM Plex Mono, monospace',
        letterSpacing: '0.05em',
        textAlign: 'center',
      }}>
        {stats.pending} en attente · {stats.skipped} ignorés
      </div>
    </div>
  );
};

interface StatCellProps {
  value: string;
  unit: string;
  color: string;
}

const StatCell: React.FC<StatCellProps> = ({ value, unit, color }) => (
  <div style={{
    flex: 1,
    background: '#0d1424',
    border: '0.5px solid #1a2740',
    borderRadius: '6px',
    padding: '8px 6px',
    textAlign: 'center',
  }}>
    <div style={{
      fontSize: '20px',
      fontWeight: 700,
      color,
      fontFamily: 'IBM Plex Mono, monospace',
      letterSpacing: '-0.02em',
      lineHeight: 1,
      marginBottom: '3px',
    }}>
      {value}
    </div>
    <div style={{
      fontSize: '8px',
      color: '#334155',
      textTransform: 'uppercase',
      letterSpacing: '0.12em',
      fontFamily: 'IBM Plex Mono, monospace',
    }}>
      {unit}
    </div>
  </div>
);
