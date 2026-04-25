import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Trash2, CheckCircle2, Copy, BarChart2 } from 'lucide-react';

export default function HistoryList({ 
  history, clearHistory, copyToClipboard, copiedId, fetchAnalytics 
}) {
  if (history.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ marginTop: '40px', paddingBottom: '40px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={24} className="text-gradient" /> Your Link History
        </h2>
        <button 
          onClick={clearHistory}
          style={{ background: 'none', border: 'none', color: 'var(--error)', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.9rem', opacity: 0.8 }}
        >
          <Trash2 size={16} /> Clear All
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {history.map((item) => (
          <div key={item.shortId} className="glass-panel" style={{ padding: '16px', display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(30, 41, 59, 0.4)' }}>
            <div style={{ flex: 1, minWidth: '200px', overflow: 'hidden' }}>
              <a href={item.fullUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: '600', fontSize: '1.1rem', display: 'block', marginBottom: '4px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {item.fullUrl}
              </a>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', margin: 0 }}>
                {item.originalUrl}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => copyToClipboard(item.fullUrl, item.shortId)}
                className="glass-button"
                style={{ padding: '8px 12px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {copiedId === item.shortId ? <CheckCircle2 size={16} /> : <Copy size={16} />} 
              </button>
              <button 
                onClick={() => fetchAnalytics(item.shortId)}
                className="glass-button"
                style={{ padding: '8px 12px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--accent-secondary)' }}
              >
                <BarChart2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
