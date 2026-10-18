import React, { useState } from 'react';
import { X, MapPin } from 'lucide-react';
import { Spinner } from '../ui/Spinner';
import { useClients } from '../../hooks/useClients';
import { orsService } from '../../services/ors.service';
import { Priority } from '../../types';

interface AddClientModalProps {
  onClose: () => void;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#0a0f1a',
  border: '0.5px solid #1e2d45',
  borderRadius: '6px',
  padding: '8px 11px',
  color: '#e2e8f0',
  fontFamily: 'IBM Plex Mono, monospace',
  fontSize: '11px',
  outline: 'none',
  transition: 'border-color 0.15s',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '9px',
  color: '#334155',
  fontFamily: 'IBM Plex Mono, monospace',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  marginBottom: '5px',
};

export const AddClientModal: React.FC<AddClientModalProps> = ({ onClose }) => {
  const { addClient } = useClients();
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodeError, setGeocodeError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '', company: '', address: '', phone: '',
    priority: 'medium' as Priority, notes: '',
    lat: 0, lng: 0,
  });

  const set = (field: string, value: string) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  const handleGeocode = async () => {
    if (!formData.address) return;
    setIsGeocoding(true);
    setGeocodeError(null);
    try {
      const result = await orsService.geocodeAddress(formData.address);
      if (result) {
        setFormData(prev => ({ ...prev, lat: result.lat, lng: result.lng }));
      } else {
        setGeocodeError('Adresse introuvable. Vérifiez et réessayez.');
      }
    } catch {
      setGeocodeError('Erreur de géocodage.');
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.lat || !formData.lng) {
      setGeocodeError("Veuillez d'abord géocoder l'adresse.");
      return;
    }
    addClient({
      id: Date.now().toString(),
      name: formData.name,
      company: formData.company,
      address: formData.address,
      phone: formData.phone,
      lat: formData.lat,
      lng: formData.lng,
      priority: formData.priority,
      status: 'pending',
      visitOrder: null,
      notes: formData.notes,
    });
    onClose();
  };

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
        width: '100%', maxWidth: '520px',
        maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px',
          borderBottom: '0.5px solid #1e2d45',
          background: '#0a0f1a',
          position: 'sticky', top: 0, zIndex: 1,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '5px', height: '16px', background: '#22c55e', borderRadius: '2px' }} />
            <span style={{
              fontSize: '12px', fontWeight: 700, color: '#f1f5f9',
              fontFamily: 'IBM Plex Mono, monospace',
              letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              Nouveau client
            </span>
          </div>
          <button onClick={onClose} style={{
            background: 'transparent', border: '0.5px solid #1e2d45',
            borderRadius: '5px', color: '#475569', cursor: 'pointer',
            width: '28px', height: '28px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <X size={14} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* Name + Company */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Nom *</label>
              <input
                required style={inputStyle}
                value={formData.name}
                onChange={e => set('name', e.target.value)}
                onFocus={e => (e.target.style.borderColor = '#3b82f6')}
                onBlur={e => (e.target.style.borderColor = '#1e2d45')}
                placeholder="Ahmed Mansour"
              />
            </div>
            <div>
              <label style={labelStyle}>Entreprise *</label>
              <input
                required style={inputStyle}
                value={formData.company}
                onChange={e => set('company', e.target.value)}
                onFocus={e => (e.target.style.borderColor = '#3b82f6')}
                onBlur={e => (e.target.style.borderColor = '#1e2d45')}
                placeholder="TechCorp Tunis"
              />
            </div>
          </div>

          {/* Address + Geocode */}
          <div>
            <label style={labelStyle}>Adresse *</label>
            <div style={{ display: 'flex', gap: '7px' }}>
              <input
                required
                style={{ ...inputStyle, flex: 1 }}
                value={formData.address}
                onChange={e => set('address', e.target.value)}
                onFocus={e => (e.target.style.borderColor = '#3b82f6')}
                onBlur={e => (e.target.style.borderColor = '#1e2d45')}
                placeholder="La Marsa, Tunis"
              />
              <button
                type="button"
                onClick={handleGeocode}
                disabled={isGeocoding || !formData.address}
                style={{
                  background: isGeocoding ? '#1e3a5f' : 'rgba(59,130,246,0.1)',
                  border: '0.5px solid rgba(59,130,246,0.3)',
                  borderRadius: '6px',
                  color: '#60a5fa',
                  cursor: isGeocoding || !formData.address ? 'not-allowed' : 'pointer',
                  padding: '0 12px',
                  display: 'flex', alignItems: 'center', gap: '5px',
                  fontSize: '10px',
                  fontFamily: 'IBM Plex Mono, monospace',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  whiteSpace: 'nowrap',
                  opacity: !formData.address ? 0.4 : 1,
                }}
              >
                {isGeocoding ? <Spinner size="sm" /> : <MapPin size={12} />}
                Géocoder
              </button>
            </div>

            {geocodeError && (
              <div style={{
                fontSize: '10px', color: '#f87171',
                fontFamily: 'IBM Plex Mono, monospace',
                marginTop: '5px',
              }}>
                ⚠ {geocodeError}
              </div>
            )}

            {formData.lat !== 0 && formData.lng !== 0 && (
              <div style={{
                fontSize: '10px', color: '#4ade80',
                fontFamily: 'IBM Plex Mono, monospace',
                marginTop: '5px',
              }}>
                ✓ {formData.lat.toFixed(4)}, {formData.lng.toFixed(4)}
              </div>
            )}
          </div>

          {/* Phone + Priority */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Téléphone *</label>
              <input
                type="tel" required style={inputStyle}
                value={formData.phone}
                onChange={e => set('phone', e.target.value)}
                onFocus={e => (e.target.style.borderColor = '#3b82f6')}
                onBlur={e => (e.target.style.borderColor = '#1e2d45')}
                placeholder="+216 71 123 456"
              />
            </div>
            <div>
              <label style={labelStyle}>Priorité</label>
              <select
                value={formData.priority}
                onChange={e => set('priority', e.target.value)}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                <option value="high">Haute</option>
                <option value="medium">Moyenne</option>
                <option value="low">Basse</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label style={labelStyle}>Notes</label>
            <textarea
              value={formData.notes}
              onChange={e => set('notes', e.target.value)}
              rows={3}
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
              onFocus={e => (e.target.style.borderColor = '#3b82f6')}
              onBlur={e => (e.target.style.borderColor = '#1e2d45')}
              placeholder="Renouvellement contrat, présentation..."
            />
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', gap: '8px', paddingTop: '4px' }}>
            <button
              type="submit"
              style={{
                flex: 1,
                background: '#22c55e',
                color: '#0a0f1a',
                border: 'none',
                borderRadius: '6px',
                padding: '10px',
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              Ajouter le client
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'transparent',
                color: '#475569',
                border: '0.5px solid #1e2d45',
                borderRadius: '6px',
                padding: '10px 18px',
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
