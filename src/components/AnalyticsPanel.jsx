import React from 'react';
import {  AnimatePresence } from 'framer-motion';
import { MousePointerClick, Calendar } from 'lucide-react';

export default function AnalyticsPanel({ analyticsError, analyticsData, setAnalyticsData }) {
  return (
    <AnimatePresence>
      {analyticsError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          style={{ color: 'var(--error)', marginTop: '20px', textAlign: 'center', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '8px' }}
        >
          {analyticsError}
        </motion.div>
      )}

      {analyticsData && (
        <motion.div
          id="analytics-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="glass-panel"
          style={{ padding: '32px', marginTop: '24px', border: '1px solid var(--accent-secondary)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 className="text-gradient" style={{ margin: 0 }}>Analytics: {analyticsData.shortId}</h2>
            <button onClick={() => setAnalyticsData(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.2rem' }}>&times;</button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '24px' }}>
            <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)', padding: '24px', borderRadius: '12px', textAlign: 'center' }}>
              <MousePointerClick size={32} style={{ color: 'var(--accent-primary)', margin: '0 auto 12px auto' }} />
              <h3 style={{ fontSize: '2rem', fontWeight: '700', margin: '0 0 8px 0' }}>{analyticsData.totalClicks}</h3>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Total Clicks Recorded</p>
            </div>
          </div>

          <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={20} />
            Visit History
          </h3>
          
          <div style={{ maxHeight: '250px', overflowY: 'auto', paddingRight: '12px' }}>
            {analyticsData.Analytics && analyticsData.Analytics.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {analyticsData.Analytics.map((entry, index) => (
                  <li key={entry._id || index} style={{ padding: '12px', borderBottom: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Visit #{index + 1}</span>
                    <span>{new Date(entry.timestamp).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px 0' }}>No visits recorded yet for this link.</p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
