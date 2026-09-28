import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../../components/Button/Button';
import { RideCard } from '../../components/RideCard/RideCard';
import { useAuth } from '../../contexts/AuthContext';
import { usersApi } from '../../api/users';
import { Ride } from '../../types';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [nextRide, setNextRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const rides = await usersApi.getMyRides();
        // Assuming the earliest upcoming ride where user is participant is next
        const upcoming = rides.filter(r => r.status === 'UPCOMING');
        if (upcoming.length > 0) {
          setNextRide(upcoming[0]); // since they are ordered by departure_time in backend
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchRides();
  }, [user]);

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-6 pt-24 pb-40">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.8, 0.25, 1] }}
        className="flex flex-col items-center text-center"
      >
        <h1 className="text-[clamp(3.5rem,8vw,6.5rem)] font-display font-[800] tracking-[-0.04em] leading-[0.9] text-black mb-8">
          Where students<br />
          going your way<br />
          <span className="text-rc-purple-400">meet.</span>
        </h1>

        <p className="text-[1.125rem] md:text-[1.25rem] text-text-secondary max-w-xl mx-auto mb-12 leading-[1.5]">
          Find people travelling the same route. Share rides, split costs, and travel safely with verified peers.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-24">
          <Button 
            size="lg" 
            className="rounded-full bg-black text-white hover:bg-zinc-800 px-8 py-4 text-lg w-full sm:w-auto transition-transform hover:scale-105"
            onClick={() => navigate('/search')}
          >
            Find a ride &rarr;
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="rounded-full border-border-medium hover:bg-zinc-50 px-8 py-4 text-lg w-full sm:w-auto transition-transform hover:scale-105"
            onClick={() => navigate('/offer')}
          >
            Offer a ride
          </Button>
        </div>

        {/* Next Ride Widget */}
        {nextRide && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-full max-w-md text-left"
          >
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-xs font-bold uppercase tracking-[0.1em] text-text-muted">Your Next Ride</h2>
              <button onClick={() => navigate('/rides')} className="text-sm font-medium text-black hover:underline">View all</button>
            </div>
            <RideCard ride={nextRide as any} onClick={() => navigate(`/rides/${nextRide.id}`)} />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
