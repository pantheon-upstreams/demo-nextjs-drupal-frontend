import { enableDraftMode } from 'next-drupal/draft';
import type { NextRequest } from 'next/server';
import { getDrupalClient } from '@/lib/drupal-client';

/**
 * Draft-mode entry point. Drupal sends a signed preview link; enableDraftMode()
 * validates it against Drupal's /next/draft-url, sets the draft cookies and
 * redirects, so the secret is verified on the Drupal side.
 */
export async function GET(request: NextRequest): Promise<Response | never> {
  return enableDraftMode(request, getDrupalClient());
}
