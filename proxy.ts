import { EnumTokens } from '@/services/auth/auth-token.service';
import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

type UserRole = 'USER' | 'OPERATOR' | 'MANAGER' | 'ADMIN';

interface TokenPayload {
    id: string;
    role: UserRole;
}

const AUTH_ROUTE = '/auth';
const HOME_ROUTE = '/';
const PROFILE_ROUTE = '/profile';

const PROTECTED_ROUTES = [
    '/profile',
    '/dashboard',
    '/operator-panel',
    '/admin',
];
const OPERATOR_ROUTES = ['/operator-panel'];
const ADMIN_MANAGER_ROUTES = ['/admin'];

function isRoute(pathname: string, routes: string[]) {
    return routes.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`),
    );
}

async function verifyRefreshToken(token: string): Promise<TokenPayload | null> {
    try {
        const secret = process.env.JWT_SECRET;

        if (!secret) {
            return null;
        }

        const { payload } = await jwtVerify(
            token,
            new TextEncoder().encode(secret),
        );

        if (
            typeof payload.id !== 'string' ||
            typeof payload.role !== 'string'
        ) {
            return null;
        }

        return {
            id: payload.id,
            role: payload.role as UserRole,
        };
    } catch {
        return null;
    }
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const refreshToken = request.cookies.get(EnumTokens.REFRESH_TOKEN)?.value;
    const isAuthPage =
        pathname === AUTH_ROUTE || pathname.startsWith(`${AUTH_ROUTE}/`);
    const isProtectedPage = isRoute(pathname, PROTECTED_ROUTES);

    let tokenPayload: TokenPayload | null = null;

    if (refreshToken) {
        tokenPayload = await verifyRefreshToken(refreshToken);
    }

    if (isAuthPage) {
        if (tokenPayload) {
            return NextResponse.redirect(new URL(PROFILE_ROUTE, request.url));
        }

        return NextResponse.next();
    }

    if (isProtectedPage && !tokenPayload) {
        return NextResponse.redirect(new URL(AUTH_ROUTE, request.url));
    }

    if (isRoute(pathname, OPERATOR_ROUTES)) {
        if (!tokenPayload) {
            return NextResponse.redirect(new URL(AUTH_ROUTE, request.url));
        }

        const allowedRoles: UserRole[] = ['OPERATOR', 'MANAGER', 'ADMIN'];

        if (!allowedRoles.includes(tokenPayload.role)) {
            return NextResponse.redirect(new URL(HOME_ROUTE, request.url));
        }
    }

    if (isRoute(pathname, ADMIN_MANAGER_ROUTES)) {
        if (!tokenPayload) {
            return NextResponse.redirect(new URL(AUTH_ROUTE, request.url));
        }

        const allowedRoles: UserRole[] = ['MANAGER', 'ADMIN'];

        if (!allowedRoles.includes(tokenPayload.role)) {
            return NextResponse.redirect(new URL(HOME_ROUTE, request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/auth/:path*',
        '/profile/:path*',
        '/dashboard/:path*',
        '/operator-panel/:path*',
        '/admin/:path*',
    ],
};
