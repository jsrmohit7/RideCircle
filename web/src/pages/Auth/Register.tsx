import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import { useAuth } from '../../contexts/AuthContext';

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({ name, email, password });
      navigate('/home');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-rc-offWhite)] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-8 rounded-[32px] border border-zinc-200 shadow-xl shadow-zinc-200/50"
      >
        <h1 className="font-display font-bold text-3xl mb-2 text-zinc-950">Join RideCircle.</h1>
        <p className="text-zinc-500 mb-8">Create an account to start coordinating rides.</p>
        
        {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            label="Full Name" 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            placeholder="Rahul Sharma"
          />
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
            placeholder="Minimum 8 characters"
          />
          <Button type="submit" variant="primary" className="w-full" isLoading={loading}>
            Create Account
          </Button>
        </form>
        
        <div className="mt-8 text-center text-zinc-500 text-sm">
          Already have an account? <Link to="/login" className="text-[var(--color-rc-purple-400)] font-medium">Sign in</Link>
        </div>
      </motion.div>
    </div>
  );
};
