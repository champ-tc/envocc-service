// File: src/app/api/options/groups/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const groups = await prisma.group.findMany({
      select: {
        id: true,
        name: true
      }
    })
    return NextResponse.json(groups)
  } catch (e) {
    return NextResponse.json({ message: 'เกิดข้อผิดพลาดขณะดึงกลุ่ม' }, { status: 500 })
  }
}
