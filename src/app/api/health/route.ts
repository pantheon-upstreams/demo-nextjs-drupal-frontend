import { NextResponse } from 'next/server';
import { testDrupalConnection } from '@/lib/drupal-fetch';

// Always run fresh — this reports live Drupal connectivity.
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await testDrupalConnection();
    return NextResponse.json({ connected: !!result.success });
  } catch {
    return NextResponse.json({ connected: false });
  }
}
