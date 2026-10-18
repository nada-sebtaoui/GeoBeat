import { useClientStore } from '../store/clientStore';
import { Client, ClientStatus } from '../types';

export const useClients = () => {
  const { clients, addClient, updateClient, deleteClient } = useClientStore();

  const markAsVisited = (id: string) => {
    updateClient(id, { status: 'visited' });
  };

  const markAsSkipped = (id: string) => {
    updateClient(id, { status: 'skipped' });
  };

  const updateStatus = (id: string, status: ClientStatus) => {
    updateClient(id, { status });
  };

  const getSortedClients = () => {
    return [...clients].sort((a, b) => {
      if (a.visitOrder === null && b.visitOrder === null) return 0;
      if (a.visitOrder === null) return 1;
      if (b.visitOrder === null) return -1;
      return a.visitOrder - b.visitOrder;
    });
  };

  const getStats = () => {
    const total = clients.length;
    const visited = clients.filter((c) => c.status === 'visited').length;
    const pending = clients.filter((c) => c.status === 'pending').length;
    const skipped = clients.filter((c) => c.status === 'skipped').length;

    return { total, visited, pending, skipped };
  };

  return {
    clients,
    addClient,
    updateClient,
    deleteClient,
    markAsVisited,
    markAsSkipped,
    updateStatus,
    getSortedClients,
    getStats,
  };
};
