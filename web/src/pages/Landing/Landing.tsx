import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button/Button';
import { Route } from '../../components/Route/Route';
import { useAuth } from '../../contexts/AuthContext';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-[var(--color-rc-offWhite)] relative overflow-hidden flex flex-col">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20" 
           style={{ backgroundImage: 'linear-gradient(to right, #e4e4e7 1px, transparent 1px), linear-gradient(to bottom, #e4e4e7 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />
      
      <div className="flex-1 max-w-5xl mx-auto w-full px-6 pt-24 pb-12 flex flex-col md:flex-row items-center justify-between z-10">
        
        <div className="max-w-lg mb-16 md:mb-0">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[clamp(3.5rem,8vw,6.5rem)] font-display font-[800] tracking-[-0.04em] leading-[0.9] text-black mb-6"
          >
            Where students <br/>
            going your way <br/>
            <span className="text-rc-purple-400">meet.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[1.125rem] md:text-[1.25rem] text-text-secondary mb-10 max-w-md leading-[1.5]"
          >
            Find people travelling the same route. Share rides, split costs, and travel safely with verified peers.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4"
          >
            <Button size="lg" className="rounded-full bg-black text-white px-8 py-4 text-lg w-full sm:w-auto" onClick={() => navigate(isAuthenticated ? '/home' : '/login')}>Find a ride →</Button>
            <Button variant="outline" size="lg" className="rounded-full border-border-medium px-8 py-4 text-lg w-full sm:w-auto hover:bg-zinc-50" onClick={() => navigate(isAuthenticated ? '/offer' : '/login')}>Offer a ride</Button>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative w-full max-w-sm bg-white p-8 rounded-[24px] border border-border-light shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
        >
          <div className="text-[10px] font-mono font-bold text-text-muted mb-8 uppercase tracking-[0.15em]">Live Network</div>
          <Route origin="BIT MESRA" destination="RANCHI STATION" vertical={true} />
          
          <div className="mt-8 flex items-center space-x-2 bg-zinc-50 p-3 rounded-2xl border border-zinc-100">
            <div className="flex -space-x-2">
              {[1,2,3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full bg-zinc-200 border-2 border-white" />
              ))}
            </div>
            <div className="text-sm font-medium text-zinc-600 pl-2">
              12 students going your way
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};
