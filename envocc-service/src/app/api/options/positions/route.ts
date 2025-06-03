// File: src/app/api/options/positions/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const positions = await prisma.position.findMany({
      select: {
        id: true,
        name: true
      }
    })
    return NextResponse.json(positions)
  } catch (e) {
    return NextResponse.json({ message: 'เกิดข้อผิดพลาดขณะดึงตำแหน่ง' }, { status: 500 })
  }
}
