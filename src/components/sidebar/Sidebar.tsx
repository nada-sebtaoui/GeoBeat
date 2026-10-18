import React, { useState } from 'react';
import { Route, Plus, AlertCircle, Play, Square } from 'lucide-react';
import { Spinner } from '../ui/Spinner';
import { ClientList } from './ClientList';
import { RouteStats } from './RouteStats';
import { AddClientModal } from '../modals/AddClientModal';
import { useOptimizeRoute } from '../../hooks/useOptimizeRoute';
import { useGeolocation } from '../../hooks/useGeolocation';
import { orsService } from '../../services/ors.service';

export const Sidebar: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const { optimize, isOptimizing, error, fallbackOptimize } = useOptimizeRoute();
  const { isSimulating, simulateMovement } = useGeolocation();
  const isOrsConfigured = orsService.isConfigured();

  const handleOptimize = () => {
    if (!isOrsConfigured) { fallbackOptimize(); return; }
    optimize();
  };

  return (
    <>
      <div style={{
        width: '360px',
        background: '#0d1424',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '0.5px solid #1e2d45',
        flexShrink: 0,
      }}>

        {/* ── Header ── */}
        <div style={{ padding: '16px', borderBottom: '0.5px solid #1e2d45' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <div style={{
              width: '10px', height: '10px',
              background: '#3b82f6',
              borderRadius: '50%',
              boxShadow: '0 0 0 3px rgba(59,130,246,0.2)',
            }} />
            <span style={{
              fontSize: '15px',
              fontWeight: 700,
              color: '#f1f5f9',
              fontFamily: 'IBM Plex Mono, monospace',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              Field Agent
            </span>
          </div>
          <div style={{
            fontSize: '9px',
            color: '#334155',
            fontFamily: 'IBM Plex Mono, monospace',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            paddingLeft: '20px',
          }}>
            Optimisation terrain · Tunis
          </div>

          {/* GPS Simulation bar */}
          {isSimulating && (
            <div style={{
              marginTop: '12px',
              background: 'rgba(59,130,246,0.07)',
              border: '0.5px solid rgba(59,130,246,0.2)',
              borderRadius: '6px',
              padding: '7px 10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <div style={{
                  width: '6px', height: '6px',
                  background: '#3b82f6',
                  borderRadius: '50%',
                  animation: 'pulse 1.5s infinite',
                }} />
                <span style={{
                  fontSize: '9px',
                  color: '#60a5fa',
                  fontFamily: 'IBM Plex Mono, monospace',
                  letterSpacing: '0.07em',
                  textTransform: 'uppercase',
                }}>
                  GPS Simulation active
                </span>
              </div>
              <button
                onClick={simulateMovement}
                style={{
                  background: 'rgba(59,130,246,0.12)',
                  border: '0.5px solid rgba(59,130,246,0.3)',
                  borderRadius: '4px',
                  color: '#60a5fa',
                  fontSize: '9px',
                  fontFamily: 'IBM Plex Mono, monospace',
                  fontWeight: 600,
                  letterSpacing: '0.07em',
                  padding: '3px 9px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Play size={10} />
                Déplacer
              </button>
            </div>
          )}
        </div>

        {/* ── ORS Warning ── */}
        {!isOrsConfigured && (
          <div style={{
            background: 'rgba(234,179,8,0.06)',
            borderBottom: '0.5px solid rgba(234,179,8,0.2)',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
          }}>
            <AlertCircle size={14} color="#facc15" style={{ flexShrink: 0, marginTop: '1px' }} />
            <div style={{
              fontSize: '10px',
              color: '#ca8a04',
              fontFamily: 'IBM Plex Mono, monospace',
              lineHeight: 1.5,
            }}>
              <strong style={{ color: '#facc15' }}>Clé ORS manquante</strong>
              {' '}— Optimisation désactivée. Tri par priorité.
            </div>
          </div>
        )}

        {/* ── Actions ── */}
        <div style={{ padding: '12px 16px', borderBottom: '0.5px solid #1e2d45', display: 'flex', flexDirection: 'column', gap: '7px' }}>

          {/* Optimize button */}
          <button
            onClick={handleOptimize}
            disabled={isOptimizing}
            style={{
              background: isOptimizing ? '#1e3a5f' : '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              padding: '11px 16px',
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: isOptimizing ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              opacity: isOptimizing ? 0.75 : 1,
              transition: 'background 0.15s',
              boxShadow: isOptimizing ? 'none' : '0 2px 12px rgba(59,130,246,0.25)',
            }}
          >
            {isOptimizing ? (
              <><Spinner size="sm" /> Optimisation en cours...</>
            ) : (
              <><Route size={15} /> Optimiser ma journée</>
            )}
          </button>

          {/* Add client button */}
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              background: 'transparent',
              color: '#475569',
              border: '0.5px solid #1e2d45',
              borderRadius: '6px',
              padding: '8px 16px',
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '7px',
              transition: 'border-color 0.15s, color 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#3b82f6';
              e.currentTarget.style.color = '#60a5fa';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#1e2d45';
              e.currentTarget.style.color = '#475569';
            }}
          >
            <Plus size={13} />
            Ajouter un client
          </button>
        </div>

        {/* ── Error ── */}
        {error && (
          <div style={{
            margin: '8px 16px 0',
            background: 'rgba(239,68,68,0.08)',
            border: '0.5px solid rgba(239,68,68,0.25)',
            borderRadius: '6px',
            padding: '8px 10px',
            fontSize: '10px',
            color: '#f87171',
            fontFamily: 'IBM Plex Mono, monospace',
          }}>
            ⚠ {error.message}
          </div>
        )}

        {/* ── Client list ── */}
        <ClientList />

        {/* ── Stats ── */}
        <RouteStats />
      </div>

      {showAddModal && (
        <AddClientModal onClose={() => setShowAddModal(false)} />
      )}
    </>
  );
};
