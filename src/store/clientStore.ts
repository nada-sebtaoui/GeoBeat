import { create } from 'zustand';
import { Client } from '../types';
import { mockClients } from '../data/mockClients';
import { storageService } from '../services/storage.service';

interface ClientState {
  clients: Client[];
  routeCoordinates: [number, number][];
  totalDistance: number;
  totalDuration: number;
  addClient: (client: Client) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  setClients: (clients: Client[]) => void;
  setRouteCoordinates: (coordinates: [number, number][]) => void;
  setRouteStats: (distance: number, duration: number) => void;
  initializeClients: () => void;
}

export const useClientStore = create<ClientState>((set, get) => ({
  clients: [],
  routeCoordinates: [],
  totalDistance: 0,
  totalDuration: 0,

  addClient: (client) => {
    const newClients = [...get().clients, client];
    set({ clients: newClients });
    storageService.saveClients(newClients);
  },

  updateClient: (id, updates) => {
    const newClients = get().clients.map((c) =>
      c.id === id ? { ...c, ...updates } : c
    );
    set({ clients: newClients });
    storageService.saveClients(newClients);
  },

  deleteClient: (id) => {
    const newClients = get().clients.filter((c) => c.id !== id);
    set({ clients: newClients });
    storageService.saveClients(newClients);
  },

  setClients: (clients) => {
    set({ clients });
    storageService.saveClients(clients);
  },

  setRouteCoordinates: (coordinates) => {
    set({ routeCoordinates: coordinates });
  },

  setRouteStats: (distance, duration) => {
    set({ totalDistance: distance, totalDuration: duration });
  },

  initializeClients: () => {
    const savedClients = storageService.loadClients();
    if (savedClients && savedClients.length > 0) {
      set({ clients: savedClients });
    } else {
      set({ clients: mockClients });
      storageService.saveClients(mockClients);
    }
  },
}));
