export type RideStatus = 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
export type RequestStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'CANCELLED';

export interface User {
  id: string;
  name: string;
  rating: number;
  totalRides: number;
  verified: boolean;
  college: string;
  bio: string;
  preferences: string[];
}

export interface Ride {
  id: string;
  creatorId: string;
  fromLocation: string;
  toLocation: string;
  departureDate: string;
  departureTime: string;
  vehicleType: string;
  totalSeats: number;
  availableSeats: number;
  contribution: number;
  notes: string;
  status: RideStatus;
  meetingPoint?: string;
  passengers: string[]; // User IDs
}

export interface RideRequest {
  id: string;
  rideId: string;
  userId: string;
  status: RequestStatus;
  createdAt: string;
}

export const mockUsers: Record<string, User> = {
  'u1': {
    id: 'u1',
    name: 'Mohit Kumar',
    rating: 4.8,
    totalRides: 54,
    verified: true,
    college: 'BIT Mesra',
    bio: 'Computer Science student',
    preferences: ['Car', 'Sports', 'Backpack']
  },
  'u2': {
    id: 'u2',
    name: 'Rahul Sharma',
    rating: 4.8,
    totalRides: 23,
    verified: true,
    college: 'BIT Mesra',
    bio: 'Electrical Engineering student. Music lover.',
    preferences: ['Car', 'Music', 'No smoking']
  },
  'u3': {
    id: 'u3',
    name: 'Aman Verma',
    rating: 4.5,
    totalRides: 12,
    verified: false,
    college: 'BIT Mesra',
    bio: 'Mechanical Eng.',
    preferences: ['Bike', 'Backpack']
  },
  'u4': {
    id: 'u4',
    name: 'Priya Singh',
    rating: 4.9,
    totalRides: 31,
    verified: true,
    college: 'Ranchi College',
    bio: 'Design student.',
    preferences: ['Car', 'Quiet']
  },
  'u5': {
    id: 'u5',
    name: 'Ananya Das',
    rating: 4.7,
    totalRides: 18,
    verified: true,
    college: 'BIT Mesra',
    bio: 'MBA student',
    preferences: ['Car']
  },
};

export const currentUser = mockUsers['u1'];

export const mockRides: Ride[] = [
  {
    id: 'r1',
    creatorId: 'u2', // Rahul
    fromLocation: 'BIT Mesra',
    toLocation: 'Ranchi Railway Station',
    departureDate: '2026-09-30',
    departureTime: '06:00 PM',
    vehicleType: 'Car',
    totalSeats: 3,
    availableSeats: 2,
    contribution: 80,
    notes: 'Leaving exactly at 6 PM. Meet near main gate.',
    status: 'UPCOMING',
    meetingPoint: 'Main college gate',
    passengers: ['u3'], // Aman is riding
  },
  {
    id: 'r2',
    creatorId: 'u4', // Priya
    fromLocation: 'Ranchi Railway Station',
    toLocation: 'BIT Mesra',
    departureDate: '2026-09-30',
    departureTime: '08:30 AM',
    vehicleType: 'Car',
    totalSeats: 4,
    availableSeats: 1,
    contribution: 70,
    notes: 'Waiting near platform 1 exit.',
    status: 'UPCOMING',
    meetingPoint: 'Platform 1 Exit',
    passengers: ['u5', 'u1'], // Ananya and Mohit are riding
  },
  {
    id: 'r3',
    creatorId: 'u1', // Mohit (Current User)
    fromLocation: 'BIT Mesra',
    toLocation: 'Airport',
    departureDate: '2026-10-02',
    departureTime: '10:00 AM',
    vehicleType: 'Car',
    totalSeats: 2,
    availableSeats: 0,
    contribution: 150,
    notes: 'Flight at 1 PM, leaving early.',
    status: 'COMPLETED',
    meetingPoint: 'Hostel 3',
    passengers: ['u2', 'u3'], 
  },
  {
    id: 'r4',
    creatorId: 'u5', // Ananya
    fromLocation: 'BIT Mesra',
    toLocation: 'City Centre',
    departureDate: '2026-10-01',
    departureTime: '05:00 PM',
    vehicleType: 'Car',
    totalSeats: 3,
    availableSeats: 3,
    contribution: 50,
    notes: 'Going for grocery shopping.',
    status: 'UPCOMING',
    meetingPoint: 'Main Gate',
    passengers: [], 
  }
];

export const mockRequests: RideRequest[] = [
  {
    id: 'req1',
    rideId: 'r4',
    userId: 'u1', // Mohit requesting to join Ananya's ride
    status: 'PENDING',
    createdAt: '2026-09-29T10:00:00Z',
  }
];
