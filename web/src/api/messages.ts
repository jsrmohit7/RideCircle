import { apiClient } from './client';
import { Message, MessageCreate } from '../types';

export const messagesApi = {
  getMessages: async (rideId: string): Promise<Message[]> => {
    const response = await apiClient.get<Message[]>(`/rides/${rideId}/messages`);
    return response.data;
  },
  
  sendMessage: async (rideId: string, message: MessageCreate): Promise<Message> => {
    const response = await apiClient.post<Message>(`/rides/${rideId}/messages`, message);
    return response.data;
  }
};
