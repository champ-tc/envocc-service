// File: src/app/admin/jobs/page.tsx
"use client"

import { useEffect, useState } from 'react'

export default function AdminJobsPage() {
  const [admin, setAdmin] = useState<any>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    // You can validate token or call /api/user/me
    setAdmin({ name: 'Admin User' })
  }, [])

  return (
    <div className="min-h-screen bg-[#f7f6f3] p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">แดชบอร์ดผู้ดูแลระบบ</h1>
        <p className="text-gray-600">ยินดีต้อนรับ, {admin?.name}</p>
        <div className="mt-6 bg-white p-6 rounded-xl shadow border border-gray-200">
          <p className="text-gray-700">คุณสามารถจัดการผู้ใช้งานและการจองห้องประชุมได้จากเมนูด้านบน</p>
        </div>
      </div>
    </div>
  )
}