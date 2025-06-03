import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/jwt'

const protectedPaths = [
    { path: '/admin', role: 'ADMIN' },
    { path: '/administrator', role: 'ADMINISTRATOR' },
    { path: '/user', role: 'USER' },
]

export function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value
    const pathname = req.nextUrl.pathname

    if (!token) {
        if (protectedPaths.some(p => pathname.startsWith(p.path))) {
            return NextResponse.redirect(new URL('/', req.url))
        }
        return NextResponse.next()
    }

    const user = verifyToken(token)
    if (!user || typeof user !== 'object' || !('role' in user)) {
        return NextResponse.redirect(new URL('/', req.url))
    }

    for (const { path, role } of protectedPaths) {
        if (pathname.startsWith(path) && user.role !== role) {
            return NextResponse.redirect(new URL('/', req.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/user/:path*', '/admin/:path*', '/administrator/:path*']
}
