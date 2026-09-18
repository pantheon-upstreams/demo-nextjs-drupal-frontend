import { draftMode } from 'next/headers';
import { getDraftData } from 'next-drupal/draft';
import { drupalFetch } from './drupal-fetch';
import { getDrupalClient, hasDrupalCredentials } from './drupal-client';

/**
 * Draft-aware JSON:API fetch for server components.
 *
 * Separate from drupal-fetch.ts, which a 'use client' component imports and so
 * cannot pull in next/headers. Outside draft mode this is a plain drupalFetch,
 * keeping published content anonymous and cacheable.
 */
export async function serverDrupalFetch(
  path: string,
  options?: RequestInit
): Promise<Response> {
  if (!(await isDraftRequest())) {
    return drupalFetch(path, options);
  }

  const draftData = await getDraftData();

  return drupalFetch(withResourceVersion(path, draftData.resourceVersion), {
    ...options,
    cache: 'no-store',
    headers: {
      ...options?.headers,
      ...(await draftAuthHeader()),
    },
  });
}

// draftMode() throws outside a request scope, including in
// generateStaticParams. At build time we are always fetching published content.
async function isDraftRequest(): Promise<boolean> {
  try {
    const { isEnabled } = await draftMode();
    return isEnabled;
  } catch {
    return false;
  }
}

const INDIVIDUAL_RESOURCE =
  /\/jsonapi\/[^/?]+\/[^/?]+\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

/**
 * JSON:API supports resourceVersion only on an individual resource. Combining
 * it with a filter — how this app looks nodes up — returns 501. Collections
 * rely on the OAuth token instead to include unpublished nodes.
 */
function withResourceVersion(path: string, resourceVersion?: string): string {
  if (path.includes('resourceVersion=') || !INDIVIDUAL_RESOURCE.test(path)) {
    return path;
  }

  const separator = path.includes('?') ? '&' : '?';

  return `${path}${separator}resourceVersion=${encodeURIComponent(
    resourceVersion || 'rel:working-copy'
  )}`;
}

// Without a token the request falls through as anonymous and Drupal returns
// only published content, which is the safe outcome.
async function draftAuthHeader(): Promise<Record<string, string>> {
  if (!hasDrupalCredentials()) {
    console.warn(
      '[draft] DRUPAL_CLIENT_ID/DRUPAL_CLIENT_SECRET are not set — '
        + 'unpublished content cannot be read.'
    );
    return {};
  }

  try {
    const token = await getDrupalClient().getAccessToken();

    return token?.access_token
      ? { Authorization: `${token.token_type} ${token.access_token}` }
      : {};
  } catch (error) {
    console.error('[draft] Failed to obtain an OAuth access token:', error);
    return {};
  }
}
