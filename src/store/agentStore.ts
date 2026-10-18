import { create } from 'zustand';
import { AgentPosition } from '../types';

interface AgentState {
  position: AgentPosition;
  isSimulating: boolean;
  setPosition: (position: AgentPosition) => void;
  setSimulating: (isSimulating: boolean) => void;
}

const DEFAULT_LAT = parseFloat(import.meta.env.VITE_DEFAULT_LAT || '36.8065');
const DEFAULT_LNG = parseFloat(import.meta.env.VITE_DEFAULT_LNG || '10.1815');

export const useAgentStore = create<AgentState>((set) => ({
  position: {
    lat: DEFAULT_LAT,
    lng: DEFAULT_LNG,
    timestamp: Date.now(),
  },
  isSimulating: import.meta.env.VITE_SIMULATE_GPS === 'true',
  setPosition: (position) => set({ position }),
  setSimulating: (isSimulating) => set({ isSimulating }),
}));
