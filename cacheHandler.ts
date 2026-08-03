import { createCacheHandler } from '@pantheon-systems/nextjs-cache-handler';

/**
 * Pantheon persistent cache handler for Next.js on Pantheon.
 * Auto-detects Google Cloud Storage (when CACHE_BUCKET is set on the platform)
 * and falls back to a file-based cache locally.
 */
const CacheHandler = createCacheHandler({
  type: 'auto',
});

export default CacheHandler;
