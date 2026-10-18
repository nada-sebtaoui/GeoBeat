import React, { useState } from 'react';
import { ClientCard } from './ClientCard';
import { ClientDetailModal } from '../modals/ClientDetailModal';
import { useClients } from '../../hooks/useClients';
import { Client } from '../../types';

export const ClientList: React.FC = () => {
  const { getSortedClients, markAsVisited, markAsSkipped } = useClients();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const sortedClients = getSortedClients();

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {sortedClients.length === 0 ? (
          <div className="text-center text-slate-400 py-8">
            Aucun client à afficher
          </div>
        ) : (
          sortedClients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onMarkVisited={() => markAsVisited(client.id)}
              onMarkSkipped={() => markAsSkipped(client.id)}
              onViewDetails={() => setSelectedClient(client)}
            />
          ))
        )}
      </div>

      {selectedClient && (
        <ClientDetailModal
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
        />
      )}
    </>
  );
};
