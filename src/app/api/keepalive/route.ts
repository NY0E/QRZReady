import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Daily Vercel Cron target (see vercel.json). The free-tier Supabase project
// pauses after about a week without requests, and account deletion depends on
// it, so this keeps it awake. The ping touches no data.
export const dynamic = 'force-dynamic';

export async function GET() {
  const { data, error } = await supabase.rpc('rpc_ping');

  if (error || data !== 1) {
    console.error('Supabase keep-alive failed:', error);
    return NextResponse.json({ ok: false }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
