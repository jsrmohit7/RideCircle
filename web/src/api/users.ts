import { apiClient } from './client';
import { User, Ride } from '../types';

export const usersApi = {
  getUser: async (id: string): Promise<User> => {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  },
  
  getMyRides: async (): Promise<Ride[]> => {
    const response = await apiClient.get<Ride[]>('/users/me/rides');
    return response.data;
  },
  
  blockUser: async (id: string): Promise<void> => {
    await apiClient.post(`/users/${id}/block`);
  },
  
  unblockUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}/block`);
  }
};
