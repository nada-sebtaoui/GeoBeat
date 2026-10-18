import { useMutation } from '@tanstack/react-query';
import { orsService } from '../services/ors.service';
import { useClientStore } from '../store/clientStore';
import { useAgentStore } from '../store/agentStore';
import { Client } from '../types';

export const useOptimizeRoute = () => {
  const { clients, setClients, setRouteCoordinates, setRouteStats } = useClientStore();
  const { position } = useAgentStore();

  const optimizeMutation = useMutation({
    mutationFn: async () => {
      if (!orsService.isConfigured()) {
        throw new Error('ORS API key not configured');
      }

      const pendingClients = clients.filter((c) => c.status === 'pending');

      if (pendingClients.length === 0) {
        throw new Error('No pending clients to optimize');
      }

      const jobs = pendingClients.map((client, index) => ({
        id: index + 1,
        location: [client.lng, client.lat] as [number, number],
        service: 900,
      }));

      const request = {
        jobs,
        vehicles: [
          {
            id: 1,
            profile: 'driving-car',
            start: [position.lng, position.lat] as [number, number],
            end: [position.lng, position.lat] as [number, number],
            time_window: [28800, 61200],
          },
        ],
      };

      const optimizationResult = await orsService.optimizeRoute(request);

      const route = optimizationResult.routes[0];
      const jobSteps = route.steps.filter((step) => step.type === 'job' && step.job);

      const updatedClients = clients.map((client) => {
        const clientIndex = pendingClients.findIndex((c) => c.id === client.id);
        if (clientIndex === -1) return client;

        const stepIndex = jobSteps.findIndex((step) => step.job === clientIndex + 1);
        return {
          ...client,
          visitOrder: stepIndex !== -1 ? stepIndex + 1 : null,
        };
      });

      const orderedCoordinates: [number, number][] = [
        [position.lng, position.lat],
        ...jobSteps.map((step) => {
          const jobIndex = step.job! - 1;
          return jobs[jobIndex].location;
        }),
        [position.lng, position.lat],
      ];

      const directionsResult = await orsService.getDirections(orderedCoordinates);
      const routeCoordinates = directionsResult.features[0].geometry.coordinates;
      const { distance, duration } = directionsResult.features[0].properties.summary;

      return {
        updatedClients,
        routeCoordinates,
        distance,
        duration,
      };
    },
    onSuccess: (data) => {
      setClients(data.updatedClients);
      setRouteCoordinates(data.routeCoordinates);
      setRouteStats(data.distance, data.duration);
    },
  });

  const fallbackOptimize = () => {
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    const sortedClients = [...clients]
      .filter((c) => c.status === 'pending')
      .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
      .map((client, index) => ({
        ...client,
        visitOrder: index + 1,
      }));

    const updatedClients = clients.map((client) => {
      const sorted = sortedClients.find((c) => c.id === client.id);
      return sorted || client;
    });

    setClients(updatedClients);
  };

  return {
    optimize: optimizeMutation.mutate,
    isOptimizing: optimizeMutation.isPending,
    error: optimizeMutation.error,
    fallbackOptimize,
  };
};
