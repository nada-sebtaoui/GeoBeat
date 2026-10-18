import { useEffect, useRef } from 'react';
import { useAgentStore } from '../store/agentStore';

export const useGeolocation = () => {
  const { position, isSimulating, setPosition, setSimulating } = useAgentStore();
  const intervalRef = useRef<number | null>(null);
  const watchIdRef = useRef<number | null>(null);

  const simulateMovement = () => {
    setPosition({
      lat: position.lat + (Math.random() - 0.5) * 0.004,
      lng: position.lng + (Math.random() - 0.5) * 0.004,
      timestamp: Date.now(),
    });
  };

  const startSimulation = () => {
    if (intervalRef.current) return;
    setSimulating(true);
    intervalRef.current = window.setInterval(simulateMovement, 3000);
  };

  const stopSimulation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setSimulating(false);
  };

  const startRealTracking = () => {
    if (!navigator.geolocation) {
      console.error('Geolocation not supported');
      return;
    }

    stopSimulation();

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          timestamp: Date.now(),
        });
      },
      (error) => {
        console.error('Geolocation error:', error);
        startSimulation();
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    if (import.meta.env.DEV && import.meta.env.VITE_SIMULATE_GPS === 'true') {
      startSimulation();
    } else {
      startRealTracking();
    }

    return () => {
      stopSimulation();
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return {
    position,
    isSimulating,
    startSimulation,
    stopSimulation,
    simulateMovement,
  };
};
