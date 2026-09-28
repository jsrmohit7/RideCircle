import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import { LocationPicker } from '../../components/LocationPicker/LocationPicker';
import { ridesApi } from '../../api/rides';

export const OfferRide: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [from, setFrom] = useState('');
  const [fromLat, setFromLat] = useState<number | undefined>();
  const [fromLng, setFromLng] = useState<number | undefined>();
  const [to, setTo] = useState('');
  const [toLat, setToLat] = useState<number | undefined>();
  const [toLng, setToLng] = useState<number | undefined>();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [seats, setSeats] = useState(3);
  const [notes, setNotes] = useState('');
  const [contribution, setContribution] = useState('');

  const nextStep = () => {
    // Basic validation per step
    if (step === 1 && (!from || !to)) return setError('Please fill all fields');
    if (step === 2 && (!date || !time)) return setError('Please fill all fields');
    if (step === 4 && (!contribution)) return setError('Please enter a contribution');
    setError('');
    setStep(s => Math.min(5, s + 1));
  };
  const prevStep = () => { setError(''); setStep(s => Math.max(1, s - 1)); };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const departureTime = new Date(`${date}T${time}`).toISOString();
      const ride = await ridesApi.createRide({
        from_location: from,
        to_location: to,
        from_lat: fromLat,
        from_lng: fromLng,
        to_lat: toLat,
        to_lng: toLng,
        departure_time: departureTime,
        vehicle_type: 'CAR',
        original_seats: seats,
        contribution: parseFloat(contribution),
        notes: notes || undefined
      });
      navigate(`/rides/${ride.id}`);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create ride');
      setLoading(false);
    }
  };

  const variants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 pt-24 pb-40 min-h-[80vh] flex flex-col">
      <div className="mb-12 flex items-center justify-between">
        <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-display font-[800] tracking-[-0.04em] leading-[0.9] text-black">Offer a ride</h1>
        <div className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-[0.15em]">0{step} / 05</div>
      </div>

      <div className="flex-1 flex flex-col justify-center relative">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="1" variants={variants} initial="initial" animate="animate" exit="exit" className="space-y-6 max-w-2xl">
              <h2 className="text-[1.5rem] md:text-[2rem] font-bold text-black mb-6">Where are you going?</h2>
              {error && <div className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}
              
              <LocationPicker 
                label="Origin" 
                placeholder="e.g. BIT Mesra" 
                value={from} 
                onChange={(val, lat, lng) => { setFrom(val); setFromLat(lat); setFromLng(lng); }} 
                autoFocus 
              />
              
              <LocationPicker 
                label="Destination" 
                placeholder="e.g. Ranchi Station" 
                value={to} 
                onChange={(val, lat, lng) => { setTo(val); setToLat(lat); setToLng(lng); }} 
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="2" variants={variants} initial="initial" animate="animate" exit="exit" className="space-y-6 max-w-2xl">
              <h2 className="text-[1.5rem] md:text-[2rem] font-bold text-black mb-6">When are you leaving?</h2>
              {error && <div className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}
              <Input label="Date" type="date" value={date} onChange={e => setDate(e.target.value)} autoFocus />
              <Input label="Time" type="time" value={time} onChange={e => setTime(e.target.value)} />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="3" variants={variants} initial="initial" animate="animate" exit="exit" className="space-y-6 max-w-2xl">
              <h2 className="text-[1.5rem] md:text-[2rem] font-bold text-black mb-6">How many seats?</h2>
              <div className="flex items-center space-x-6 bg-white p-6 rounded-[24px] border border-border-light shadow-sm w-max">
                <Button variant="outline" className="w-14 h-14 rounded-full text-2xl border-border-medium hover:bg-zinc-50" onClick={() => setSeats(Math.max(1, seats - 1))}>-</Button>
                <div className="font-mono text-3xl font-bold w-16 text-center text-black">{seats}</div>
                <Button variant="outline" className="w-14 h-14 rounded-full text-2xl border-border-medium hover:bg-zinc-50" onClick={() => setSeats(seats + 1)}>+</Button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="4" variants={variants} initial="initial" animate="animate" exit="exit" className="space-y-6 max-w-2xl">
              <h2 className="text-[1.5rem] md:text-[2rem] font-bold text-black mb-6">Anything passengers should know?</h2>
              {error && <div className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}
              <Input label="Notes (Optional)" placeholder="e.g. Leaving from hostel gate" value={notes} onChange={e => setNotes(e.target.value)} autoFocus />
              <Input label="Suggested Contribution (₹)" type="number" placeholder="80" value={contribution} onChange={e => setContribution(e.target.value)} />
            </motion.div>
          )}

          {step === 5 && (
            <motion.div key="5" variants={variants} initial="initial" animate="animate" exit="exit" className="space-y-6 max-w-2xl">
              <h2 className="text-[1.5rem] md:text-[2rem] font-bold text-black mb-6">Review your ride</h2>
              {error && <div className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}
              <div className="bg-white p-8 rounded-[24px] border border-border-light shadow-sm space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-border-light">
                  <span className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-[0.1em]">Route</span>
                  <span className="font-bold text-black">{from} → {to}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border-light">
                  <span className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-[0.1em]">Departure</span>
                  <span className="font-bold text-black">{date} at {time}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border-light">
                  <span className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-[0.1em]">Seats</span>
                  <span className="font-bold text-black">{seats} available</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-[0.1em]">Contribution</span>
                  <span className="font-mono font-bold text-lg text-rc-purple-500">₹{contribution}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 flex items-center justify-between">
        {step > 1 ? (
          <Button variant="ghost" onClick={prevStep}>Back</Button>
        ) : (
          <div />
        )}
        
        {step < 5 ? (
          <Button onClick={nextStep}>Next →</Button>
        ) : (
          <Button onClick={handleSubmit} isLoading={loading}>Publish ride</Button>
        )}
      </div>
    </div>
  );
};
