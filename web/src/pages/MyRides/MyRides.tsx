import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RideCard } from '../../components/RideCard/RideCard';
import { usersApi } from '../../api/users';
import { Ride } from '../../types';

export const MyRides: React.FC = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'UPCOMING' | 'COMPLETED' | 'CANCELLED'>('UPCOMING');
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const data = await usersApi.getMyRides();
        setRides(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchRides();
  }, []);

  const displayedRides = rides.filter(r => r.status === tab);

  return (
    <div className="max-w-5xl mx-auto px-6 pt-24 pb-40">
      <h1 className="text-[clamp(3.5rem,8vw,6.5rem)] font-display font-[800] tracking-[-0.04em] leading-[0.9] text-black mb-12">My Rides</h1>
      
      <div className="flex space-x-8 mb-12 border-b border-border-light max-w-2xl">
        <button 
          onClick={() => setTab('UPCOMING')}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 ${tab === 'UPCOMING' ? 'border-black text-black' : 'border-transparent text-zinc-500 hover:text-zinc-800'}`}
        >
          Upcoming
        </button>
        <button 
          onClick={() => setTab('COMPLETED')}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 ${tab === 'COMPLETED' ? 'border-black text-black' : 'border-transparent text-zinc-500 hover:text-zinc-800'}`}
        >
          Completed
        </button>
        <button 
          onClick={() => setTab('CANCELLED')}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 ${tab === 'CANCELLED' ? 'border-black text-black' : 'border-transparent text-zinc-500 hover:text-zinc-800'}`}
        >
          Cancelled
        </button>
      </div>

      <div className="space-y-6 max-w-2xl">
        {loading ? (
          <div className="text-center py-12 text-text-muted text-sm font-medium">Loading rides...</div>
        ) : displayedRides.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-[24px] border border-border-light shadow-sm">
            <div className="text-text-muted mb-4 font-medium">No rides found in this category.</div>
            <button onClick={() => navigate('/offer')} className="text-sm font-bold text-rc-purple-500 hover:underline">
              Offer a ride →
            </button>
          </div>
        ) : (
          displayedRides.map(ride => (
            <RideCard key={ride.id} ride={ride as any} onClick={() => navigate(`/rides/${ride.id}`)} />
          ))
        )}
      </div>
    </div>
  );
};
