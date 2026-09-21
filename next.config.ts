import type { NextConfig } from "next";
import path from "path";

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

// Derive the Drupal host (for next/image) from the configured backend URL, so the
// upstream carries no hardcoded per-site hostnames.
function drupalHostname(): string | undefined {
  const raw = process.env.NEXT_IMAGE_DOMAIN || process.env.NEXT_PUBLIC_DRUPAL_BASE_URL;
  if (!raw) return undefined;
  try {
    return raw.includes('://') ? new URL(raw).hostname : raw;
  } catch {
    return raw;
  }
}

const drupalHost = drupalHostname();
const drupalBaseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'http://localhost:8080';

const nextConfig: NextConfig = {
  // Standalone container build + Pantheon's persistent cache handler (ISR,
  // route handlers and the fetch cache; the in-memory cache is off so the
  // handler is authoritative). Only affects `next build`/`next start`.
  // The cache handler must not go in transpilePackages — that makes the edge
  // compiler ignore its edge-safe entry and the build fails on `fs`.
  output: 'standalone',
  cacheHandler: path.resolve('./cache-handler.mjs'),
  cacheMaxMemorySize: 0,

  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  // Next.js 16 blocks cross-origin requests to dev resources (HMR / Fast Refresh)
  // by default. The dev server runs on 0.0.0.0:3000 but the browser loads the site
  // through the DDEV proxy host, so without this the page never hydrates
  // and nothing interactive (theme toggle, menu) works. Allow the proxy hosts.
  allowedDevOrigins: [
    '*.ddev.site',
    '*.pantheonsite.io',
  ],
  images: {
    // Next.js 16 blocks the image optimizer from fetching upstreams that resolve
    // to private IPs (SSRF protection). In local dev the Drupal backend lives on
    // a private Docker network IP (DDEV), so allow it in development only.
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== 'production',
    remotePatterns: [
      // The Drupal backend host, derived from env (NEXT_IMAGE_DOMAIN / NEXT_PUBLIC_DRUPAL_BASE_URL).
      ...(drupalHost
        ? [
            { protocol: 'http' as const, hostname: drupalHost, pathname: '/**' },
            { protocol: 'https' as const, hostname: drupalHost, pathname: '/**' },
          ]
        : []),
      // Allow any Pantheon-hosted Drupal environment (dev/test/live/multidev) for images.
      { protocol: 'https', hostname: '*.pantheonsite.io', pathname: '/**' },
    ],
  },
  // Proxy Drupal API requests; helps when server-side Node.js can't reach the external URL.
  async rewrites() {
    return [
      {
        source: '/api/drupal/:path*',
        destination: `${drupalBaseUrl}/:path*`,
      },
    ];
  },
  // Disable strict mode to avoid double fetches in development
  reactStrictMode: false,
};

export default withMDX(nextConfig);
