import { NextRequest, NextResponse } from 'next/server';
import { checkSubdomainAvailability } from '@/lib/auth-signup';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const subdomain = searchParams.get('subdomain');

  if (!subdomain) {
    return NextResponse.json({ error: 'Subdomain required' }, { status: 400 });
  }

  try {
    const available = await checkSubdomainAvailability(subdomain);
    return NextResponse.json({ available });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}