import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import { useAuth } from '../../contexts/AuthContext';

import { GoogleLogin } from '@react-oauth/google';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
      navigate('/home');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setError('');
    setLoading(true);
    try {
      if (credentialResponse.credential) {
        await loginWithGoogle(credentialResponse.credential);
        navigate('/home');
      } else {
        setError('Failed to receive Google credential');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google authentication was cancelled or failed.');
  };

  return (
    <div className="min-h-screen bg-[var(--color-rc-offWhite)] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-8 rounded-[32px] border border-zinc-200 shadow-xl shadow-zinc-200/50"
      >
        <h1 className="font-display font-bold text-3xl mb-2 text-zinc-950">Welcome back.</h1>
        <p className="text-zinc-500 mb-8">Sign in to coordinate your next ride.</p>
        
        {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            label="College Email" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            placeholder="name@college.edu"
          />
          <Input 
            label="Password" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            placeholder="••••••••"
          />
          <Button type="submit" variant="primary" className="w-full" isLoading={loading}>
            Sign In
          </Button>
        </form>

        <div className="mt-6 flex items-center">
          <div className="flex-1 border-t border-zinc-200"></div>
          <span className="px-3 text-xs text-zinc-400 uppercase tracking-wider">or</span>
          <div className="flex-1 border-t border-zinc-200"></div>
        </div>

        <div className="mt-6 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            width="100%"
            theme="outline"
            size="large"
            text="continue_with"
            shape="rectangular"
          />
        </div>
        
        <div className="mt-8 text-center text-zinc-500 text-sm">
          Don't have an account? <Link to="/register" className="text-[var(--color-rc-purple-400)] font-medium">Create one</Link>
        </div>
      </motion.div>
    </div>
  );
};
