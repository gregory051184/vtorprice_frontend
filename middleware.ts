import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;

const protectedRoutes = ['/create-applications', '/manager', '/profile', '/registration', '/deals/new', '/equipment-deals'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next')
    || pathname.startsWith('/api')
    || pathname.startsWith('/static')
    || PUBLIC_FILE.test(pathname)
    || process.env.NEXT_PUBLIC_MODE === 'OFFLINE_DEVELOPMENT'
  ) {
    return NextResponse.next();
  }
  const ACCESS_TOKEN = request.cookies.get('access_token')?.value;
  

  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !ACCESS_TOKEN) {
    return NextResponse.redirect(new URL('/need-auth', request.url));
  }

  // if (!pathname.startsWith('/registration')) {
  //   try {
  //     if (!ACCESS_TOKEN) {
  //       return;
  //     }
  //     const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/`, {
  //       headers: {
  //         Authorization: `JWT ${ACCESS_TOKEN}`,
  //       },
  //       cache: 'no-store'
  //     });
  //     if (resp.ok) {
  //       const user = await resp.json();
  //       if (!user.company && (user?.role?.id === 5 || !user?.role)) {
  //           return NextResponse.redirect(new URL('/registration', request.url));
  //         }
  //     }
  //     throw new Error('authorization error');
  //   } catch (e: unknown) {
  //     if (e instanceof TypeError) {
  //       // @ts-ignore
  //       if (e.cause.name === 'ConnectTimeoutError') {
  //         return NextResponse.redirect(new URL('/404', request.url));
  //       }
  //     }
  //   }
  // }

  return NextResponse.next({
    request
  });
}
