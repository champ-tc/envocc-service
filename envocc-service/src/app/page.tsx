'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    const data = await res.json()

    if (res.ok) {
      toast.success('เข้าสู่ระบบสำเร็จ')
      if (data.role === 'ADMIN') {
        router.push('/admin/jobs')
      } else {
        router.push('/user/main')
      }
    } else {
      toast.error(data.message || 'เกิดข้อผิดพลาด')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 bg-white p-8 rounded-2xl shadow-md"
      >
        <h1 className="text-2xl font-bold text-center text-gray-800">เข้าสู่ระบบ</h1>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อผู้ใช้</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-xl bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-gray-800"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่าน</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-xl bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-gray-800"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-700 text-white hover:bg-gray-800 font-semibold py-2 rounded-xl transition"
        >
          {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
        </button>

        <div className="text-center text-sm text-gray-500">
          ยังไม่มีบัญชี? <a href="/register" className="text-gray-800 hover:underline">ลงทะเบียน</a>
        </div>
      </form>
    </div>
  )
}
