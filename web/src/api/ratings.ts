import { apiClient } from './client';
import { Rating, RatingCreate } from '../types';

export const ratingsApi = {
  createRating: async (rating: RatingCreate): Promise<Rating> => {
    const response = await apiClient.post<Rating>('/ratings', rating);
    return response.data;
  },
  
  getUserRatings: async (userId: string): Promise<Rating[]> => {
    const response = await apiClient.get<Rating[]>(`/ratings/user/${userId}`);
    return response.data;
  }
};
