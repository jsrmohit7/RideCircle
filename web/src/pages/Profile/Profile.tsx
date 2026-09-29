import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Avatar } from '../../components/Avatar/Avatar';
import { Button } from '../../components/Button/Button';

export const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  if (!user) return null;
  return (
    <div className="max-w-3xl mx-auto px-6 pt-24 pb-40">
      <h1 className="text-[clamp(3.5rem,8vw,6.5rem)] font-display font-[800] tracking-[-0.04em] leading-[0.9] text-black mb-12">Profile</h1>
      
      <div className="bg-white p-12 rounded-[32px] border border-border-light shadow-[0_8px_30px_rgba(0,0,0,0.06)] mb-8 text-center flex flex-col items-center">
        <Avatar name={user.name} src={user.profile_image} size="lg" />
        <h2 className="text-[2rem] font-bold text-black mt-6">{user.name}</h2>
        <div className="text-[10px] font-mono font-bold text-text-muted mt-2 mb-6 uppercase tracking-[0.1em]">
          ⭐ {user.rating.toFixed(1)} {user.verified && <span className="text-green-600 ml-2">✓ Verified student</span>}
        </div>
        <div className="bg-bg-soft px-6 py-3 rounded-full text-xs font-bold text-black border border-border-medium tracking-[0.05em]">
          College ID: {user.college_id || 'BIT Mesra'}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-12">
        <div className="bg-white p-8 rounded-[24px] border border-border-light text-center shadow-sm">
          <div className="text-[2.5rem] font-mono font-bold text-black">{user.total_rides}</div>
          <div className="text-[10px] text-text-muted uppercase tracking-[0.15em] font-bold mt-2">Total Rides</div>
        </div>
        <div className="bg-white p-8 rounded-[24px] border border-border-light text-center shadow-sm">
          <div className="text-[2.5rem] font-mono font-bold text-black">{user.rating.toFixed(1)}</div>
          <div className="text-[10px] text-text-muted uppercase tracking-[0.15em] font-bold mt-2">Avg Rating</div>
        </div>
      </div>

      <section className="mb-12">
        <h3 className="text-[10px] font-mono font-bold text-text-muted mb-4 uppercase tracking-[0.15em]">ABOUT</h3>
        <p className="text-black font-medium leading-[1.6] bg-white p-8 rounded-[24px] border border-border-light shadow-sm">
          {user.bio || 'No bio provided yet.'}
        </p>
      </section>

      <div className="mt-16 text-center">
        <Button variant="outline" className="border-border-medium hover:bg-zinc-50 rounded-full px-8 py-4 text-lg" onClick={logout}>Sign Out</Button>
      </div>
    </div>
  );
};
