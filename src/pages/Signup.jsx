import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL;;

export default function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await axios.post(`${API_BASE}/user`, formData);
      login(response.data.user, response.data.token);
      setMessage({ text: 'Signup successful! Welcome ' + response.data.user.name, type: 'success' });
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      setMessage({ text: err.response?.data?.error || 'Signup failed.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      style={{ width: '100%', maxWidth: '400px' }}
    >
      <div className="glass-panel" style={{ padding: '40px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '8px' }}>
            Create Account
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Sign up to track and manage your links.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                setLoading(true);
                const response = await axios.post(`${API_BASE}/user/google-login`, {
                  credential: credentialResponse.credential
                });
                login(response.data.user, response.data.token);
                setMessage({ text: 'Google Sign-in successful!', type: 'success' });
                setTimeout(() => navigate('/'), 1000);
              } catch (err) {
                setMessage({ text: err.response?.data?.error || 'Google Sign-in failed.', type: 'error' });
              } finally {
                setLoading(false);
              }
            }}
            onError={() => {
              setMessage({ text: 'Google Sign-in failed. Please try again.', type: 'error' });
            }}
            theme="filled_black"
            text="signup_with"
            shape="pill"
          />
        </div>

        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', margin: '24px 0', fontSize: '0.9rem' }}>
          — OR —
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ position: 'relative' }}>
            <User style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={20} />
            <input
              type="text"
              required
              placeholder="Full Name"
              className="glass-input"
              style={{ paddingLeft: '48px' }}
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
          <div style={{ position: 'relative' }}>
            <Mail style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={20} />
            <input
              type="email"
              required
              placeholder="Email Address"
              className="glass-input"
              style={{ paddingLeft: '48px' }}
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={20} />
            <input
              type="password"
              required
              placeholder="Password"
              className="glass-input"
              style={{ paddingLeft: '48px' }}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          {message.text && (
            <div style={{ 
              padding: '12px', 
              borderRadius: '8px', 
              backgroundColor: message.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
              color: message.type === 'error' ? 'var(--error)' : 'var(--success)',
              textAlign: 'center',
              fontSize: '0.9rem'
            }}>
              {message.text}
            </div>
          )}

          <button 
            type="submit" 
            className="glass-button" 
            disabled={loading}
            style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
          >
            {loading ? 'Processing...' : 'Sign Up'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-secondary)' }}>
          Already have an account? 
          <Link 
            to="/login"
            style={{ 
              color: 'var(--accent-primary)', 
              fontWeight: '600', 
              textDecoration: 'none',
              marginLeft: '4px'
            }}
          >
            Sign In
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
