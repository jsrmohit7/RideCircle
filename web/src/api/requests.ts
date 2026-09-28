import { apiClient } from './client';
import { RideRequest } from '../types';

export const requestsApi = {
  requestSeat: async (rideId: string): Promise<RideRequest> => {
    const response = await apiClient.post<RideRequest>(`/rides/${rideId}/requests`);
    return response.data;
  },
  
  updateRequest: async (requestId: string, action: 'ACCEPT' | 'DECLINE' | 'CANCEL'): Promise<void> => {
    await apiClient.patch(`/rides/requests/${requestId}?action=${action}`);
  }
};
