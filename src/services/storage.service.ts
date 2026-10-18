import { Client } from '../types';

const STORAGE_KEY = 'field-agent-clients';

export const storageService = {
  saveClients: (clients: Client[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
    } catch (error) {
      console.error('Failed to save clients to localStorage:', error);
    }
  },

  loadClients: (): Client[] | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load clients from localStorage:', error);
      return null;
    }
  },

  clearClients: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear clients from localStorage:', error);
    }
  },
};
