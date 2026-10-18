export type Priority = 'high' | 'medium' | 'low';
export type ClientStatus = 'pending' | 'visited' | 'skipped';

export interface Client {
  id: string;
  name: string;
  company: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  priority: Priority;
  status: ClientStatus;
  visitOrder: number | null;
  notes: string;
}

export interface AgentPosition {
  lat: number;
  lng: number;
  timestamp: number;
}

export interface RouteStats {
  totalDistance: number;
  totalDuration: number;
  visitedCount: number;
  totalCount: number;
}

export interface ORSOptimizationJob {
  id: number;
  location: [number, number];
  service: number;
}

export interface ORSVehicle {
  id: number;
  profile: string;
  start: [number, number];
  end: [number, number];
  time_window: [number, number];
}

export interface ORSOptimizationRequest {
  jobs: ORSOptimizationJob[];
  vehicles: ORSVehicle[];
}

export interface ORSOptimizationResponse {
  routes: Array<{
    steps: Array<{
      type: string;
      job?: number;
      arrival: number;
      duration: number;
      distance: number;
    }>;
    distance: number;
    duration: number;
  }>;
}

export interface ORSDirectionsResponse {
  features: Array<{
    geometry: {
      coordinates: [number, number][];
    };
    properties: {
      summary: {
        distance: number;
        duration: number;
      };
    };
  }>;
}
