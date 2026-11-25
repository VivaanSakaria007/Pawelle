import { useState, useEffect } from 'react';
import { dbStore } from '../services/store';

/**
 * Subscribes a React component to live dbStore updates across local actions,
 * sibling browser tabs, other browser profiles, and LAN devices via Vite SSE sync.
 */
export function useStoreSync(): number {
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const unsubscribe = dbStore.subscribe(() => {
      setRevision(prev => prev + 1);
    });
    return unsubscribe;
  }, []);

  return revision;
}
