import React from 'react';
import { X, MapPin, Phone, Building, FileText, Hash } from 'lucide-react';
import { Client } from '../../types';
import { Badge } from '../ui/Badge';

interface ClientDetailModalProps {
  client: Client;
  onClose: () => void;
}

export const ClientDetailModal: React.FC<ClientDetailModalProps> = ({ client, onClose }) => {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 2000, padding: '16px',
      backdropFilter: 'blur(2px)',
      animation: 'fade-in 0.15s ease-out',
    }}>
      <div style={{
        background: '#0d1424',
        border: '0.5px solid #1e2d45',
        borderRadius: '10px',
        width: '100%', maxWidth: '460px',
        boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
        animation: 'slide-in-left 0.18s ease-out',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px',
          borderBottom: '0.5px solid #1e2d45',
          background: '#0a0f1a',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '5px', height: '16px',
              background: '#3b82f6',
              borderRadius: '2px',
            }} />
            <span style={{
              fontSize: '12px',
              fontWeight: 700,
              color: '#f1f5f9',
              fontFamily: 'IBM Plex Mono, monospace',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              Fiche client
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: '0.5px solid #1e2d45',
              borderRadius: '5px',
              color: '#475569',
              cursor: 'pointer',
              width: '28px', height: '28px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '16px' }}>
          {/* Name + order + badges */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div>
              <div style={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#f1f5f9',
                fontFamily: 'IBM Plex Mono, monospace',
                letterSpacing: '-0.01em',
                marginBottom: '4px',
              }}>
                {client.name}
              </div>
              {client.visitOrder !== null && (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  background: 'rgba(59,130,246,0.12)',
                  color: '#60a5fa',
                  borderRadius: '4px',
                  padding: '2px 9px',
                  fontSize: '10px',
                  fontFamily: 'IBM Plex Mono, monospace',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  border: '0.5px solid rgba(59,130,246,0.25)',
                }}>
                  <Hash size={10} />
                  Visite {client.visitOrder}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '5px', flexDirection: 'column', alignItems: 'flex-end' }}>
              <Badge type="priority" value={client.priority} />
              <Badge type="status" value={client.status} />
            </div>
          </div>

          {/* Details rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <DetailRow icon={<Building size={14} />} label="Entreprise" value={client.company} />
            <DetailRow
              icon={<MapPin size={14} />}
              label="Adresse"
              value={client.address}
              sub={`${client.lat.toFixed(4)}, ${client.lng.toFixed(4)}`}
            />
            <DetailRow
              icon={<Phone size={14} />}
              label="Téléphone"
              value={client.phone}
              isLink={`tel:${client.phone}`}
            />
            {client.notes && (
              <DetailRow icon={<FileText size={14} />} label="Notes" value={client.notes} />
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 16px',
          borderTop: '0.5px solid #1e2d45',
          display: 'flex',
          justifyContent: 'flex-end',
        }}>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              color: '#475569',
              border: '0.5px solid #1e2d45',
              borderRadius: '6px',
              padding: '7px 16px',
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

interface DetailRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  isLink?: string;
}

const DetailRow: React.FC<DetailRowProps> = ({ icon, label, value, sub, isLink }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
    <div style={{ color: '#334155', marginTop: '1px', flexShrink: 0 }}>{icon}</div>
    <div>
      <div style={{
        fontSize: '9px', color: '#334155',
        fontFamily: 'IBM Plex Mono, monospace',
        textTransform: 'uppercase', letterSpacing: '0.1em',
        marginBottom: '2px',
      }}>
        {label}
      </div>
      {isLink ? (
        <a href={isLink} style={{
          fontSize: '12px', color: '#60a5fa',
          fontFamily: 'IBM Plex Mono, monospace',
          textDecoration: 'none',
        }}>
          {value}
        </a>
      ) : (
        <div style={{
          fontSize: '12px', color: '#e2e8f0',
          fontFamily: 'IBM Plex Mono, monospace',
        }}>
          {value}
        </div>
      )}
      {sub && (
        <div style={{
          fontSize: '9px', color: '#1e2d45',
          fontFamily: 'IBM Plex Mono, monospace',
          marginTop: '2px',
        }}>
          {sub}
        </div>
      )}
    </div>
  </div>
);
