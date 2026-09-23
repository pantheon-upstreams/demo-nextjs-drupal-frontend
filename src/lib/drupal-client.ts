import { NextDrupal } from 'next-drupal';

export function hasDrupalCredentials(): boolean {
  return Boolean(
    process.env.DRUPAL_CLIENT_ID && process.env.DRUPAL_CLIENT_SECRET
  );
}

let client: NextDrupal | undefined;

/**
 * Shared NextDrupal client, used by the draft routes and for OAuth tokens.
 *
 * Built on first use, not at module scope: NextDrupal throws on a partial auth
 * object, which would fail the build anywhere the secrets are absent at build
 * time. Server-only — holds the client secret.
 */
export function getDrupalClient(): NextDrupal {
  if (!client) {
    client = new NextDrupal(
      process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'http://localhost:8080',
      {
        ...(hasDrupalCredentials()
          ? {
              auth: {
                clientId: process.env.DRUPAL_CLIENT_ID as string,
                clientSecret: process.env.DRUPAL_CLIENT_SECRET as string,
              },
            }
          : {}),
        withAuth: false,
      }
    );
  }

  return client;
}

// Discards the client and its cached access token.
export function resetDrupalClient(): void {
  client = undefined;
}
