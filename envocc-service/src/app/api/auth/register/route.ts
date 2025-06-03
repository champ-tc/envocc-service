// ✅ BACKEND - File: src/app/api/auth/register/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

const registerSchema = z.object({
    prefix: z.string().min(1),
    thaiName: z.string().min(1),
    engName: z.string().min(1),
    username: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(8)
        .regex(/[a-z]/).regex(/[A-Z]/).regex(/[0-9]/),
    groupId: z.string().min(1),
    positionId: z.string().min(1),
    phone: z.string().min(1),
    lineId: z.string().min(1),
})


export async function POST(req: Request) {
    try {
        const body = await req.json()
        const parsed = registerSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json({ message: 'ข้อมูลไม่ถูกต้อง', errors: parsed.error.flatten().fieldErrors }, { status: 400 })
        }

        const { username, email, password } = parsed.data

        const [existingUsername, existingEmail] = await Promise.all([
            prisma.user.findUnique({ where: { username } }),
            prisma.user.findUnique({ where: { email } }),
        ])

        if (existingUsername) {
            return NextResponse.json({ message: 'Username นี้ถูกใช้แล้ว' }, { status: 400 })
        }

        if (existingEmail) {
            return NextResponse.json({ message: 'Email นี้ถูกใช้แล้ว' }, { status: 400 })
        }

        const hash = await bcrypt.hash(password, 10)

        await prisma.user.create({
            data: {
                username,
                email,
                password: hash,
                prefix: parsed.data.prefix,
                thaiName: parsed.data.thaiName,
                engName: parsed.data.engName,
                phone: parsed.data.phone,
                lineId: parsed.data.lineId,
                groupId: parsed.data.groupId,
                positionId: parsed.data.positionId,
                role: 'USER',
                status: 'PENDING'
            }
        })


        return NextResponse.json({ message: 'สมัครสมาชิกสำเร็จ โปรดรอการอนุมัติจากแอดมิน' })
    } catch (e) {
        return NextResponse.json({ message: 'เกิดข้อผิดพลาด', error: e }, { status: 500 })
    }
}
