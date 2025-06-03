'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import UserNavbar from '@/components/UserNavbar'
import Image from 'next/image'

export default function UserMainPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch('/api/auth/check', {
          credentials: 'include',
        })

        if (!res.ok) {
          router.push('/')
          return
        }

        const data = await res.json()
        if (data.role !== 'USER') {
          router.push('/')
          return
        }

        setUser(data)
      } catch {
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    checkLogin()
  }, [])

  if (loading) return <div className="text-center mt-10">กำลังโหลด...</div>

  const menuItems = [
    { key: 'room_booking', label: 'จองห้องประชุม', icon: '/icons/room.png' },
    { key: 'conference', label: 'ขอใช้งาน Conference', icon: '/icons/conference.png' },
    // เพิ่มเมนูอื่น ๆ พร้อม icon เฉพาะได้ที่นี่
  ]

  const showForm = (key: string) => {
    if (key === 'room_booking') {
      router.push('/user/room/list')
    } else {
      alert(`เปิดฟอร์ม: ${key}`)
    }
  }

  return (
    <div className="pt-16 pb-16 min-h-screen relative bg-white text-black">
      <UserNavbar />
      <div className="p-4">
        <div id="menu" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => showForm(item.key)}
              className="menu-button text-black border border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center text-sm text-center cursor-pointer hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-800 transition"
            >
              <Image
                src={item.icon}
                alt={item.label}
                width={62}
                height={62}
                className="mb-2"
              />
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
