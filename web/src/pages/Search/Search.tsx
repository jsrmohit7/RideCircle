import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Filter, X } from 'lucide-react';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import { LocationPicker } from '../../components/LocationPicker/LocationPicker';
import { RideCard } from '../../components/RideCard/RideCard';
import { ridesApi } from '../../api/rides';
import { Ride } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

export const Search: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<Ride[]>([]);
  
  // Filter states
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [seats, setSeats] = useState('');

  const fetchRides = async (searchParams?: any) => {
    setLoading(true);
    try {
      const data = await ridesApi.searchRides(searchParams || {});
      setResults(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  const handleSearch = () => {
    setHasSearched(true);
    fetchRides({
      from_location: from || undefined,
      to_location: to || undefined,
      date: date || undefined
    });
  };

  const handleReset = () => {
    setFrom('');
    setTo('');
    setDate('');
    setSeats('');
    setHasSearched(false);
    fetchRides();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 pb-32">
      <div className="mb-12">
        <h1 className="text-4xl md:text-6xl font-display font-[800] tracking-[-0.04em] text-black mb-3">
          RIDES
        </h1>
        <p className="text-xl text-zinc-500 font-medium">
          Find students heading your way.
        </p>
      </div>

      {/* Search Toggle */}
      <div className="mb-10">
        {!isSearchOpen ? (
          <Button 
            variant="outline" 
            onClick={() => setIsSearchOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 h-14 rounded-full border-zinc-200 shadow-sm hover:border-rc-purple-400 hover:text-rc-purple-500"
          >
            <SearchIcon size={20} />
            <span className="font-bold">Search rides</span>
          </Button>
        ) : (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-white p-6 sm:p-8 rounded-[24px] border border-zinc-200 shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Filter size={20} />
                Filter Rides
              </h3>
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="p-2 text-zinc-400 hover:text-black rounded-full hover:bg-zinc-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <LocationPicker 
                label="From" 
                placeholder="Origin" 
                value={from} 
                onChange={val => setFrom(val)} 
              />
              <LocationPicker 
                label="To" 
                placeholder="Destination" 
                value={to} 
                onChange={val => setTo(val)} 
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input label="Date" type="date" value={date} onChange={e => setDate(e.target.value)} />
                <Input label="Time" type="time" />
                <Input label="Seats needed" type="number" min="1" value={seats} onChange={e => setSeats(e.target.value)} placeholder="1" />
              </div>
              <div className="flex gap-3 pt-2">
                <Button className="flex-1" onClick={handleSearch} isLoading={loading}>Search</Button>
                {hasSearched && (
                  <Button variant="outline" onClick={handleReset}>Clear</Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Rides List */}
      <div className="space-y-8">
        <h2 className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-[0.15em] border-b border-zinc-200 pb-3">
          {hasSearched ? 'SEARCH RESULTS' : 'ALL RIDES'}
        </h2>

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[200px] bg-zinc-100 animate-pulse rounded-[24px]"></div>
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-6">
            {results.map(ride => (
              <RideCard 
                key={ride.id} 
                ride={ride as any} 
                isCurrentUser={user?.id === ride.creator_id}
                onClick={() => navigate(`/rides/${ride.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 px-6 bg-white rounded-[24px] border border-zinc-100 shadow-sm">
            <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <SearchIcon size={24} className="text-zinc-300" />
            </div>
            <h3 className="text-xl font-bold text-black mb-2">No rides heading your way yet.</h3>
            <p className="text-zinc-500 mb-6">Try another route or date.</p>
            {hasSearched && (
              <Button variant="outline" onClick={handleReset} className="rounded-full">
                Search again
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
