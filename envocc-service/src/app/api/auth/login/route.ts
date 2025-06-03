import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Status } from '@prisma/client'
import { signToken } from '@/lib/jwt'
import bcrypt from 'bcryptjs'

const loginAttempts: Record<string, { count: number; time: number }> = {}

export async function POST(req: Request) {
    const { username, password } = await req.json()

    // Limit login attempts per minute
    if (!loginAttempts[username]) {
        loginAttempts[username] = { count: 0, time: Date.now() }
    } else {
        const timeDiff = Date.now() - loginAttempts[username].time
        if (timeDiff < 60_000) {
            if (loginAttempts[username].count >= 5) {
                return NextResponse.json(
                    { message: 'พยายามเข้าสู่ระบบเกินกำหนด กรุณารอสักครู่' },
                    { status: 429 }
                )
            }
            loginAttempts[username].count++
        } else {
            loginAttempts[username] = { count: 1, time: Date.now() }
        }
    }

    const user = await prisma.user.findUnique({ where: { username } })

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return NextResponse.json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' }, { status: 401 })
    }

    if (user.status !== Status.ACTIVE) {
        return NextResponse.json({ message: 'บัญชีของคุณยังไม่ได้รับการอนุมัติ' }, { status: 403 })
    }

    const token = signToken({ userId: user.id, role: user.role })

    const res = NextResponse.json({ message: 'เข้าสู่ระบบสำเร็จ', role: user.role }) // ✅ ไม่ส่ง token
    res.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60,
    })

    return res
}
