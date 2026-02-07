import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If no session, redirect to login
  if (!session) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/admin/staff/login';
    return NextResponse.redirect(redirectUrl);
  }

  // Check if user is staff
  const { data: staffUser } = await supabase
    .from('staff_users')
    .select('*')
    .eq('auth_user_id', session.user.id)
    .single();

  if (!staffUser) {
    // Not a staff member, sign out and redirect
    await supabase.auth.signOut();
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/admin/staff/login';
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: '/admin/staff/:path*',
};