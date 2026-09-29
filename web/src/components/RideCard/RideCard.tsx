import React from 'react';
import { motion } from 'framer-motion';
import { Route } from '../Route/Route';
import { Badge } from '../Badge/Badge';
import { Avatar } from '../Avatar/Avatar';
import { Button } from '../Button/Button';
import { Ride, User } from '../../types';

interface RideCardProps {
  ride: Ride;
  onClick?: () => void;
  onRequest?: () => void;
  isCurrentUser?: boolean;
}

export const RideCard: React.FC<RideCardProps> = ({ ride, onClick, onRequest, isCurrentUser }) => {
  const creator = ride.creator || { name: 'Unknown', rating: 5.0, profile_image: undefined };

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: [0.25, 0.8, 0.25, 1] }}
      className="bg-white rounded-[24px] border border-border-light p-6 md:p-8 shadow-sm hover:shadow-lg hover:border-rc-purple-200 transition-all cursor-pointer flex flex-col group"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-8">
        <span className="font-mono text-[0.85rem] font-bold tracking-widest text-text-muted">{new Date(ride.departure_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        <div className="flex gap-2">
          {isCurrentUser && <span className="text-[10px] uppercase font-bold tracking-[0.1em] px-3 py-1 rounded-full bg-black text-white">YOUR RIDE</span>}
          {ride.status === 'UPCOMING' && <span className="text-[10px] uppercase font-bold tracking-[0.1em] px-3 py-1 rounded-full bg-rc-purple-100/10 text-rc-purple-500 border border-rc-purple-200/30">UPCOMING</span>}
        </div>
      </div>

      <Route origin={ride.from_location} destination={ride.to_location} className="mb-8" />

      <div className="mt-10 flex flex-col space-y-5 pt-6 border-t border-border-light">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar name={creator.name} src={creator.profile_image} size="sm" />
            <div>
              <div className="text-sm font-bold text-black">{creator.name}</div>
              <div className="text-xs font-mono text-text-muted mt-0.5">⭐ {creator.rating.toFixed(1)}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-lg font-bold text-black">₹{ride.contribution}</div>
            <div className="text-[10px] uppercase tracking-wider text-text-muted font-bold mt-0.5">{ride.available_seats} SEATS LEFT</div>
          </div>
        </div>
        
        {onRequest && (
          <Button 
            className="w-full mt-2" 
            onClick={(e) => { e.stopPropagation(); onRequest(); }}
          >
            Request seat →
          </Button>
        )}
      </div>
    </motion.div>
  );
};
