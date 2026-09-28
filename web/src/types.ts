export interface User {
  id: string;
  name: string;
  email: string;
  college_id?: string;
  bio?: string;
  profile_image?: string;
  rating: number;
  total_rides: number;
  verified: boolean;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password?: string;
  college_id?: string;
}

export interface Ride {
  id: string;
  creator_id: string;
  creator?: User;
  from_location: string;
  to_location: string;
  departure_time: string;
  vehicle_type: string;
  original_seats: number;
  available_seats: number;
  contribution: number;
  notes?: string;
  from_lat?: number;
  from_lng?: number;
  to_lat?: number;
  to_lng?: number;
  status: 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  created_at: string;
  requests?: Array<RideRequest & { user: User }>;
  passengers?: Array<{ id: string; user: User }>;
}

export interface RideCreate {
  from_location: string;
  to_location: string;
  departure_time: string;
  vehicle_type: string;
  original_seats: number;
  contribution: number;
  notes?: string;
  from_lat?: number;
  from_lng?: number;
  to_lat?: number;
  to_lng?: number;
}

export interface RideRequest {
  id: string;
  ride_id: string;
  user_id: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'CANCELLED';
  created_at: string;
}

export interface Message {
  id: string;
  ride_id: string;
  sender_id: string;
  message: string;
  created_at: string;
}

export interface MessageCreate {
  message: string;
}

export interface Rating {
  id: string;
  ride_id: string;
  from_user_id: string;
  to_user_id: string;
  rating: number;
  feedback?: string;
  created_at: string;
}

export interface RatingCreate {
  ride_id: string;
  to_user_id: string;
  rating: number;
  feedback?: string;
}

export interface Report {
  id: string;
  reporter_id: string;
  reported_user_id: string;
  ride_id?: string;
  reason: string;
  description?: string;
  status: 'OPEN' | 'REVIEWING' | 'RESOLVED' | 'DISMISSED';
  created_at: string;
}

export interface ReportCreate {
  reported_user_id: string;
  ride_id?: string;
  reason: string;
  description?: string;
}
