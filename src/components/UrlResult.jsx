import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Copy, BarChart2 } from 'lucide-react';

export default function UrlResult({ 
  result, copyToClipboard, copiedId, fetchAnalytics, analyticsLoading 
}) {
  return (
    <AnimatePresence>
      {result && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          style={{ marginTop: '24px', padding: '20px', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', border: '1px solid var(--accent-primary)' }}
        >
          <p style={{ color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '0.9rem' }}>Latest Output:</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              readOnly 
              value={result.fullUrl} 
              className="glass-input"
              style={{ color: 'var(--accent-primary)', fontWeight: '600', flex: 1, minWidth: '200px' }}
            />
            <button 
              type="button"
              onClick={() => copyToClipboard(result.fullUrl, result.shortId)}
              className="glass-button"
              style={{ padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title="Copy to clipboard"
            >
              {copiedId === result.shortId ? <CheckCircle2 size={20} /> : <Copy size={20} />}
            </button>
            <button 
              type="button"
              onClick={() => fetchAnalytics(result.shortId)}
              className="glass-button"
              style={{ padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--accent-secondary)' }}
              title="View Analytics"
              disabled={analyticsLoading}
            >
              <BarChart2 size={20} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
