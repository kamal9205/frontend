import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

import UrlForm from '../components/UrlForm';
import UrlResult from '../components/UrlResult';
import AnalyticsPanel from '../components/AnalyticsPanel';
import HistoryList from '../components/HistoryList';

const API_BASE = import.meta.env.VITE_API_URL;; 

export default function Home() {
  // --- Local Storage Helpers ---
  const loadLocal = (key, defaultVal) => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultVal;
    } catch {
      return defaultVal;
    }
  };

  const { token } = useContext(AuthContext);

  // --- States ---
  const [url, setUrl] = useState(() => loadLocal('shorty_input_url', ''));
  const [customId, setCustomId] = useState(() => loadLocal('shorty_custom_id', ''));
  const [loading, setLoading] = useState(false);
  
  // result: { fullUrl, shortId, originalUrl }
  const [result, setResult] = useState(() => loadLocal('shorty_result', null)); 
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState(null); // Track which ID was copied to show checkmark

  // Analytics State
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  // analyticsData: { shortId, totalClicks, Analytics }
  const [analyticsData, setAnalyticsData] = useState(() => loadLocal('shorty_analytics_data', null));
  const [analyticsError, setAnalyticsError] = useState('');

  // History State
  const [history, setHistory] = useState(() => loadLocal('shorty_history', []));

  // --- Persist state on change ---
  useEffect(() => {
    localStorage.setItem('shorty_input_url', JSON.stringify(url));
  }, [url]);

  useEffect(() => {
    localStorage.setItem('shorty_custom_id', JSON.stringify(customId));
  }, [customId]);

  useEffect(() => {
    localStorage.setItem('shorty_result', JSON.stringify(result));
  }, [result]);

  useEffect(() => {
    localStorage.setItem('shorty_analytics_data', JSON.stringify(analyticsData));
  }, [analyticsData]);

  useEffect(() => {
    localStorage.setItem('shorty_history', JSON.stringify(history));
  }, [history]);

  // --- Handlers ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Clear previous analytics to focus on the new link processing
    setAnalyticsData(null);
    setAnalyticsError('');

    try {
      const payload = { url };
      if (customId.trim()) {
        payload.customId = customId.trim();
      }

      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.post(`${API_BASE}/url`, payload, { headers });
      const newResult = {
        fullUrl: `${API_BASE}/${response.data.id}`,
        shortId: response.data.id,
        originalUrl: url,
        createdAt: new Date().toISOString()
      };

      setResult(newResult);
      
      // Prepend to history (if it doesn't already exist or bump it to top)
      setHistory(prev => {
        const filtered = prev.filter(item => item.shortId !== newResult.shortId);
        return [newResult, ...filtered];
      });

    } catch (err) {
      setError(err.response?.data?.error || 'Failed to shorten URL');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (textToCopy, id) => {
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const fetchAnalytics = async (shortIdToFetch) => {
    if (!shortIdToFetch) return;
    
    setAnalyticsLoading(true);
    setAnalyticsError('');
    // Clear old data while loading just to give visual feedback
    setAnalyticsData(null); 
    
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.get(`${API_BASE}/url/analytics/${shortIdToFetch}`, { headers });
      setAnalyticsData({
        shortId: shortIdToFetch, // keep track of which ID this pertains to
        ...response.data
      });
      
      // Auto-scroll down gently to analytics section (timeout ensures DOM painted)
      setTimeout(() => {
        document.getElementById('analytics-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      setAnalyticsError(err.response?.data?.error || 'Failed to fetch analytics.');
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear your local link history?')) {
      setHistory([]);
      setResult(null);
      setAnalyticsData(null);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '16px' }}>
          Shorten Your URLs
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
          Create sleek, memorable, and trackable links in seconds.
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '32px' }}>
        <UrlForm 
          url={url} 
          setUrl={setUrl} 
          customId={customId} 
          setCustomId={setCustomId} 
          loading={loading} 
          handleSubmit={handleSubmit} 
          error={error} 
        />
        
        <UrlResult 
          result={result} 
          copyToClipboard={copyToClipboard} 
          copiedId={copiedId} 
          fetchAnalytics={fetchAnalytics} 
          analyticsLoading={analyticsLoading} 
        />
      </div>

      <AnalyticsPanel 
        analyticsError={analyticsError} 
        analyticsData={analyticsData} 
        setAnalyticsData={setAnalyticsData} 
      />

      <HistoryList 
        history={history} 
        clearHistory={clearHistory} 
        copyToClipboard={copyToClipboard} 
        copiedId={copiedId} 
        fetchAnalytics={fetchAnalytics} 
      />
    </motion.div>
  );
}
