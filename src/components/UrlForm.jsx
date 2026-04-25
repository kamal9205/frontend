import React from 'react';
import { Link2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function UrlForm({ 
  url, setUrl, customId, setCustomId, loading, handleSubmit, error 
}) {
  return (
    <>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--text-secondary)' }}>
            Destination URL <span style={{ color: 'var(--error)' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <Link2 style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={20} />
            <input
              type="url"
              required
              placeholder="https://example.com/very-long-url"
              className="glass-input"
              style={{ paddingLeft: '48px' }}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        </div>

        <div>
           <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--text-secondary)' }}>
            Custom Alias (Optional)
          </label>
          <input
            type="text"
            placeholder="my-custom-link"
            className="glass-input"
            value={customId}
            onChange={(e) => setCustomId(e.target.value)}
          />
        </div>

        <button 
          type="submit" 
          className="glass-button" 
          disabled={loading || !url}
          style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
        >
          {loading ? 'Generating...' : 'Shorten URL'}
          {!loading && <ArrowRight size={18} />}
        </button>
      </form>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ color: 'var(--error)', marginTop: '20px', textAlign: 'center', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '8px', overflow: 'hidden' }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
