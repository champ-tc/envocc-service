// ✅ File: src/app/api/room/[id]/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
    req: Request,
    context: { params: { id: string } } // ← ใช้ context แล้วอ่านค่า params
) {
    const { id } = context.params // ✅ ต้องแยกค่าจาก context ก่อน

    try {
        const room = await prisma.room.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                description: true,
                imageUrl: true,
                capacity: true,
                hasEquipment: true,
                bookings: {
                    select: {
                        id: true,
                        meetingTitle: true,
                        meetingChair: true,
                        attendees: true,
                        dateStart: true,
                        dateEnd: true,
                        startTime: true,
                        endTime: true,
                    },
                    orderBy: { dateStart: 'asc' },
                },
            },
        })

        if (!room) {
            return NextResponse.json({ message: 'ไม่พบห้องประชุม' }, { status: 404 })
        }

        return NextResponse.json(room)
    } catch (error) {
        console.error('Room fetch error:', error)
        return NextResponse.json({ message: 'Server error' }, { status: 500 })
    }
}
