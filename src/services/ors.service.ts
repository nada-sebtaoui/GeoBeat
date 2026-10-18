import axios from 'axios';
import { ORSOptimizationRequest, ORSOptimizationResponse, ORSDirectionsResponse } from '../types';

const ORS_BASE_URL = 'https://api.openrouteservice.org';
const API_KEY = import.meta.env.VITE_ORS_API_KEY;

const orsClient = axios.create({
  baseURL: ORS_BASE_URL,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  },
});

export const orsService = {
  optimizeRoute: async (request: ORSOptimizationRequest): Promise<ORSOptimizationResponse> => {
    const response = await orsClient.post<ORSOptimizationResponse>('/optimization', request);
    return response.data;
  },

  getDirections: async (coordinates: [number, number][]): Promise<ORSDirectionsResponse> => {
    const response = await orsClient.post<ORSDirectionsResponse>(
      '/v2/directions/driving-car/geojson',
      { coordinates }
    );
    return response.data;
  },

  geocodeAddress: async (address: string): Promise<{ lat: number; lng: number } | null> => {
    try {
      const response = await orsClient.get('/geocode/search', {
        params: {
          api_key: API_KEY,
          text: address,
          'boundary.country': 'TN',
        },
      });
      
      const features = response.data.features;
      if (features && features.length > 0) {
        const [lng, lat] = features[0].geometry.coordinates;
        return { lat, lng };
      }
      return null;
    } catch (error) {
      console.error('Geocoding failed:', error);
      return null;
    }
  },

  isConfigured: (): boolean => {
    return !!API_KEY && API_KEY !== 'your_openrouteservice_api_key_here';
  },
};
