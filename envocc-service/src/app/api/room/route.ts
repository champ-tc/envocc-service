import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const rooms = await prisma.room.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                imageUrl: true,
                capacity: true,
            },
        })


        return NextResponse.json(rooms)
    } catch (error) {
        return NextResponse.json({ message: 'เกิดข้อผิดพลาด' }, { status: 500 })
    }
}
