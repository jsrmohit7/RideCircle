import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Route } from '../../components/Route/Route';
import { Avatar } from '../../components/Avatar/Avatar';
import { Button } from '../../components/Button/Button';
import { Badge } from '../../components/Badge/Badge';
import { Input } from '../../components/Input/Input';
import { ridesApi } from '../../api/rides';
import { requestsApi } from '../../api/requests';
import { messagesApi } from '../../api/messages';
import { ratingsApi } from '../../api/ratings';
import { useAuth } from '../../contexts/AuthContext';
import { Ride, Message } from '../../types';

export const RideDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ride, setRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);
  const [requestLoading, setRequestLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingLoading, setRatingLoading] = useState(false);

  const fetchRide = async () => {
    if (!id) return;
    try {
      const data = await ridesApi.getRide(id);
      setRide(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRide();
  }, [id]);

  useEffect(() => {
    let interval: any;
    if (showChat && id) {
      const fetchMessages = async () => {
        try {
          const msgs = await messagesApi.getMessages(id);
          setMessages(msgs);
        } catch(e) { console.error(e); }
      };
      fetchMessages();
      interval = setInterval(fetchMessages, 5000);
    }
    return () => clearInterval(interval);
  }, [showChat, id]);

  const handleSendMessage = async () => {
    if (!id || !newMessage.trim()) return;
    try {
      await messagesApi.sendMessage(id, { message: newMessage });
      setNewMessage('');
      const msgs = await messagesApi.getMessages(id);
      setMessages(msgs);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRequestSeat = async () => {
    if (!id) return;
    setRequestLoading(true);
    try {
      await requestsApi.requestSeat(id);
      await fetchRide(); // Refresh
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to request seat');
    } finally {
      setRequestLoading(false);
    }
  };

  const handleRequestAction = async (reqId: string, action: 'ACCEPT' | 'DECLINE') => {
    try {
      await requestsApi.updateRequest(reqId, action);
      await fetchRide();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update request');
    }
  };

  const handleRating = async () => {
    if (!id || !ride || !user || rating === 0) return;
    setRatingLoading(true);
    // Find the person to rate. If user is creator, rate passenger? Wait, UI asks "How was your ride?". Usually you rate the driver.
    // For MVP, if user is passenger, rate creator.
    const toUserId = ride.creator_id;
    try {
      await ratingsApi.createRating({
        ride_id: id,
        to_user_id: toUserId,
        rating: rating,
        feedback: ''
      });
      alert('Thank you for rating!');
      await fetchRide();
    } catch (e: any) {
      setError(e.response?.data?.detail || 'Failed to submit rating');
    } finally {
      setRatingLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-zinc-500">Loading ride...</div>;
  if (!ride) return <div className="p-8 text-center text-zinc-500">Ride not found</div>;

  const creator = ride.creator || { name: 'Unknown', rating: 5.0, verified: false };
  const passengers = ride.passengers?.map(p => p.user) || [];
  const pendingRequests = ride.requests?.filter(r => r.status === 'PENDING') || [];
  
  const isCreator = user?.id === ride.creator_id;
  const isPassenger = passengers.some(p => p.id === user?.id);
  const hasRequested = ride.requests?.some(r => r.user_id === user?.id);
  const myRequest = ride.requests?.find(r => r.user_id === user?.id);

  return (
    <div className="max-w-5xl mx-auto px-6 pt-24 pb-40 flex flex-col md:flex-row gap-12 items-start">
      
      <div className="flex-1 w-full max-w-2xl">
        <button onClick={() => navigate(-1)} className="mb-12 text-sm font-bold text-text-muted hover:text-black transition-colors uppercase tracking-[0.1em]">← Back to rides</button>
        
        {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">{error}</div>}
        
        <div className="bg-white p-8 rounded-[24px] border border-border-light shadow-[0_8px_30px_rgba(0,0,0,0.06)] mb-12">
          <h1 className="text-[10px] font-mono font-bold text-text-muted mb-8 uppercase tracking-[0.15em]">YOUR RIDE</h1>
          
          <Route origin={ride.from_location} destination={ride.to_location} className="mb-8" />
          
          <div className="flex justify-between items-center pt-6 border-t border-border-light">
          <div>
            <div className="text-zinc-500 text-sm">Departure</div>
            <div className="font-mono font-medium text-zinc-900 mt-1">{new Date(ride.departure_time).toLocaleDateString()}</div>
          </div>
          <div className="text-right">
            <div className="text-text-muted text-[10px] font-mono font-bold uppercase tracking-[0.1em]">Time</div>
            <div className="font-sans font-bold text-black mt-1">{new Date(ride.departure_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
          </div>
          </div>
        </div>
      </div>

      <div className="w-full md:w-[380px] shrink-0 space-y-12">
        <section>
          <h2 className="text-[10px] font-mono font-bold text-text-muted mb-4 uppercase tracking-[0.15em]">DRIVER</h2>
          <div className="flex items-center space-x-4 bg-white p-6 rounded-[24px] border border-border-light shadow-sm">
            <Avatar name={creator.name} size="lg" />
            <div>
              <div className="font-bold text-black">{creator.name}</div>
              <div className="text-[10px] font-mono font-bold text-text-muted mt-1 uppercase tracking-[0.1em]">
                ⭐ {creator.rating.toFixed(1)} {creator.verified && <span className="text-green-600 ml-2">✓ Verified</span>}
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-[10px] font-mono font-bold text-text-muted mb-4 uppercase tracking-[0.15em]">PASSENGERS ({passengers.length}/{ride.original_seats})</h2>
          <div className="bg-white rounded-[24px] border border-border-light divide-y divide-border-light overflow-hidden shadow-sm">
            {passengers.length === 0 && <div className="p-6 text-sm text-text-muted font-medium">No passengers yet</div>}
            {passengers.map(p => (
              <div key={p.id} className="flex items-center space-x-3 p-6">
                <Avatar name={p.name} size="md" />
                <div className="font-bold text-black">{p.name}</div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-[10px] font-mono font-bold text-text-muted mb-4 uppercase tracking-[0.15em]">MEETING POINT</h2>
          <div className="bg-white p-6 rounded-[24px] border border-border-light font-bold text-black shadow-sm">
            {ride.notes || 'Not specified'}
          </div>
        </section>

        <section>
          <h2 className="text-[10px] font-mono font-bold text-text-muted mb-4 uppercase tracking-[0.15em]">CONTRIBUTION</h2>
          <div className="bg-white p-6 rounded-[24px] border border-border-light flex justify-between items-center shadow-sm">
            <span className="font-bold text-black">Suggested amount</span>
            <span className="font-mono font-bold text-rc-purple-500 text-2xl">₹{ride.contribution}</span>
          </div>
        </section>

        {isCreator && pendingRequests.length > 0 && (
          <section>
            <h2 className="text-[10px] font-mono font-bold text-text-muted mb-4 uppercase tracking-[0.15em]">RIDE REQUESTS</h2>
            <div className="space-y-4">
              {pendingRequests.map(req => (
                <div key={req.id} className="bg-white p-6 rounded-[24px] border border-border-light flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                  <div className="flex items-center space-x-3 w-full sm:w-auto">
                    <Avatar name={req.user.name} size="sm" />
                    <div>
                      <div className="font-bold text-black">{req.user.name}</div>
                      <div className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-[0.1em]">⭐ {req.user.rating.toFixed(1)}</div>
                    </div>
                  </div>
                  <div className="flex space-x-2 w-full sm:w-auto">
                    <Button variant="outline" className="flex-1 sm:flex-none border-border-medium hover:bg-zinc-50" onClick={() => handleRequestAction(req.id, 'DECLINE')}>Decline</Button>
                    <Button className="flex-1 sm:flex-none" onClick={() => handleRequestAction(req.id, 'ACCEPT')}>Accept</Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {!isCreator && !isPassenger && !hasRequested && (
          <Button className="w-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] text-lg py-4 rounded-full" size="lg" onClick={handleRequestSeat} isLoading={requestLoading}>Request seat</Button>
        )}

        {!isCreator && !isPassenger && hasRequested && (
          <Button className="w-full shadow-sm text-lg py-4 rounded-full bg-zinc-200 text-zinc-500" size="lg" disabled>
            {myRequest?.status === 'PENDING' ? 'Request sent ✓ Pending' : myRequest?.status === 'DECLINED' ? 'Request Declined' : 'Requested'}
          </Button>
        )}

        {ride.status === 'COMPLETED' && isPassenger && (
          <section className="mt-12 pt-12 border-t border-border-light text-center">
            <h2 className="text-[2rem] font-bold text-black mb-4">How was your ride?</h2>
            <div className="flex justify-center space-x-2 mb-8">
              {[1,2,3,4,5].map(star => (
                <button key={star} onClick={() => setRating(star)} className={`text-4xl transition-transform hover:scale-110 ${rating >= star ? 'text-yellow-400' : 'text-zinc-200'}`}>
                  ★
                </button>
              ))}
            </div>
            {rating > 0 && <Button className="w-full rounded-full py-4 text-lg" onClick={handleRating} isLoading={ratingLoading}>Submit rating</Button>}
          </section>
        )}

        {(isCreator || isPassenger) && !showChat && ride.status !== 'COMPLETED' && (
          <Button className="w-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] rounded-full py-4 text-lg mt-4" size="lg" onClick={() => setShowChat(true)}>Message group →</Button>
        )}

        {showChat && (
          <section className="mt-12 pt-8 border-t border-border-light">
            <h2 className="text-[10px] font-mono font-bold text-text-muted mb-4 uppercase tracking-[0.15em]">GROUP CHAT</h2>
            <div className="bg-white rounded-[24px] border border-border-light p-6 h-80 overflow-y-auto flex flex-col space-y-4 mb-4 shadow-sm">
              {messages.length === 0 && <div className="text-text-muted text-sm font-medium text-center my-auto">Start the conversation.</div>}
              {messages.map(msg => (
                <div key={msg.id} className={`flex flex-col ${msg.sender_id === user?.id ? 'items-end' : 'items-start'}`}>
                  <div className={`px-5 py-3 rounded-[20px] max-w-[85%] text-[15px] font-medium leading-[1.4] ${msg.sender_id === user?.id ? 'bg-rc-purple-400 text-white rounded-br-sm shadow-[0_4px_12px_rgba(161,20,233,0.3)]' : 'bg-bg-soft text-black rounded-bl-sm'}`}>
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <Input className="flex-1" placeholder="Type a message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} />
              <Button onClick={handleSendMessage} className="rounded-[16px] px-6">Send</Button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
