import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MapView } from './components/map/MapView';
import { Sidebar } from './components/sidebar/Sidebar';
import { useClientStore } from './store/clientStore';
import { useGeolocation } from './hooks/useGeolocation';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function AppContent() {
  const { initializeClients } = useClientStore();
  useGeolocation();

  useEffect(() => {
    initializeClients();
  }, [initializeClients]);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1">
        <MapView />
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
