import { createCacheHandler } from '@pantheon-systems/nextjs-cache-handler';

// Persistent cache for ISR, route handlers and the fetch cache. Uses Google
// Cloud Storage on Pantheon, a file cache locally.
const CacheHandler = createCacheHandler({
  type: 'auto',
});

export default CacheHandler;
