import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/jwt'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
    const token = req.cookies.get('token')?.value

    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded || typeof decoded !== 'object' || !('userId' in decoded)) {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
        where: { id: decoded.userId as string },
        select: { id: true, username: true, role: true },
    })

    if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
}
