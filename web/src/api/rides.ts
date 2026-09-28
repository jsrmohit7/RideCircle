import { apiClient } from './client';
import { Ride, RideCreate } from '../types';

export const ridesApi = {
  searchRides: async (params?: { from_location?: string; to_location?: string; date?: string }): Promise<Ride[]> => {
    const response = await apiClient.get<Ride[]>('/rides', { params });
    return response.data;
  },
  
  getRide: async (id: string): Promise<Ride> => {
    const response = await apiClient.get<Ride>(`/rides/${id}`);
    return response.data;
  },
  
  createRide: async (ride: RideCreate): Promise<Ride> => {
    const response = await apiClient.post<Ride>('/rides', ride);
    return response.data;
  },
  
  cancelRide: async (id: string): Promise<void> => {
    await apiClient.delete(`/rides/${id}`);
  },
  
  completeRide: async (id: string): Promise<void> => {
    await apiClient.post(`/rides/${id}/complete`);
  }
};
