import { revalidatePath, revalidateTag } from 'next/cache';
import type { NextRequest } from 'next/server';

/**
 * On-demand revalidation for the Next.js for Drupal module.
 *
 * Accepts both revalidator plugins, which send a GET:
 *   Cache Tag  ?tags=node:12,node_list:article&secret=...
 *   Path       ?path=/posts/my-post&secret=...
 */
async function handler(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const path = searchParams.get('path');
  const tags = searchParams.get('tags');
  const secret = searchParams.get('secret');

  if (!process.env.DRUPAL_REVALIDATE_SECRET) {
    console.error('[revalidate] DRUPAL_REVALIDATE_SECRET is not set — rejecting.');
    return new Response('Invalid secret.', { status: 401 });
  }

  if (secret !== process.env.DRUPAL_REVALIDATE_SECRET) {
    return new Response('Invalid secret.', { status: 401 });
  }

  if (!path && !tags) {
    return new Response('Missing path or tags.', { status: 400 });
  }

  try {
    if (path) {
      revalidatePath(path);
    }

    if (tags) {
      tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)
        .forEach((tag) => revalidateTag(tag, { expire: 0 }));
    }

    return new Response('Revalidated.', {
      headers: {
        'Cache-Control': 'private, no-cache, no-store, max-age=0, must-revalidate',
      },
    });
  } catch (error) {
    console.error('[revalidate] Failed:', error);
    return new Response((error as Error).message, { status: 500 });
  }
}

export { handler as GET, handler as POST };
