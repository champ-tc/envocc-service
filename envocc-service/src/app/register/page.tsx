'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

export default function RegisterPage() {
  const [form, setForm] = useState({
    prefix: '',
    thaiName: '',
    engName: '',
    username: '',
    email: '',
    password: '',
    phone: '',
    lineId: '',
    groupId: '',
    positionId: ''
  })
  const [groups, setGroups] = useState([])
  const [positions, setPositions] = useState([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/options/groups').then(res => res.json()).then(setGroups)
    fetch('/api/options/positions').then(res => res.json()).then(setPositions)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })

    const data = await res.json()
    if (res.ok) {
      toast.success(data.message)
      router.push('../')
    } else {
      toast.error(data.message || 'สมัครไม่สำเร็จ')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-xl bg-white p-8 rounded-2xl shadow space-y-5">
        <h1 className="text-2xl font-bold text-center text-gray-800">ลงทะเบียนผู้ใช้งาน</h1>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">คำนำหน้า</label>
            <select name="prefix" value={form.prefix} onChange={handleChange} required className="w-full border rounded-xl px-3 py-2">
              <option value="">-- เลือก --</option>
              <option>นาย</option>
              <option>นาง</option>
              <option>นางสาว</option>
              <option>ว่าที่ร้อยตรี</option>
              <option>ว่าที่ร้อยตรีหญิง</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">ชื่อผู้ใช้</label>
            <input name="username" value={form.username} onChange={handleChange} required className="w-full border rounded-xl px-3 py-2" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">ชื่อ-นามสกุล (TH)</label>
            <input name="thaiName" value={form.thaiName} onChange={handleChange} required className="w-full border rounded-xl px-3 py-2" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">ชื่อ-นามสกุล (EN)</label>
            <input name="engName" value={form.engName} onChange={handleChange} required className="w-full border rounded-xl px-3 py-2" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">เบอร์โทรศัพท์</label>
            <input name="phone" value={form.phone} onChange={handleChange} required className="w-full border rounded-xl px-3 py-2" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">LINE ID</label>
            <input name="lineId" value={form.lineId} onChange={handleChange} required className="w-full border rounded-xl px-3 py-2" />
          </div>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">อีเมล</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full border rounded-xl px-3 py-2" />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">รหัสผ่าน</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} required className="w-full border rounded-xl px-3 py-2" />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">กลุ่ม</label>
          <select name="groupId" value={form.groupId} onChange={handleChange} required className="w-full border rounded-xl px-3 py-2">
            <option value="">-- เลือกกลุ่ม --</option>
            {groups.map((g: any) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">ตำแหน่ง</label>
          <select name="positionId" value={form.positionId} onChange={handleChange} required className="w-full border rounded-xl px-3 py-2">
            <option value="">-- เลือกตำแหน่ง --</option>
            {positions.map((p: any) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-gray-700 text-white hover:bg-gray-800 py-2 rounded-xl mt-4">
          {loading ? 'กำลังสมัคร...' : 'ลงทะเบียน'}
        </button>

        <div className="text-center text-sm mt-2">
          <a href="/" className="text-gray-700 hover:underline">ย้อนกลับเข้าสู่ระบบ</a>
        </div>
      </form>
    </div>
  )
}
