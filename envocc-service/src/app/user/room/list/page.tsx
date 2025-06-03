'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import UserNavbar from '@/components/UserNavbar'
import Image from 'next/image'

type Room = {
    id: string
    name: string
    description: string
    imageUrl: string
    capacity: number
}

export default function RoomListPage() {
    const [rooms, setRooms] = useState<Room[]>([])
    const router = useRouter()

    useEffect(() => {
        fetch('/api/room')
            .then((res) => res.json())
            .then(setRooms)
    }, [])

    return (
        <div className="pt-16 pb-16 min-h-screen relative bg-white text-black">
            <UserNavbar />
            <h1 className="text-3xl font-extrabold text-center mb-8 text-gray-800">เลือกห้องประชุม</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                    <div
                        key={room.id}
                        className="rounded-3xl overflow-hidden shadow-md bg-white hover:shadow-xl transition duration-300"
                    >
                        <div className="relative w-full h-48 overflow-hidden">
                            <Image
                                src={room.imageUrl || '/icons/room.png'}
                                alt={room.name}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute top-2 right-2 bg-white text-sm text-gray-700 px-3 py-1 rounded-full shadow">
                                👥 {room.capacity} คน
                            </div>
                        </div>

                        <div className="p-5 bg-white">
                            <h2 className="text-xl font-bold text-gray-900 mb-2">{room.name}</h2>
                            <p className="text-gray-500 text-sm line-clamp-2 mb-4">{room.description}</p>

                            <button
                                onClick={() => router.push(`/user/room/${room.id}`)}
                                className="w-full py-2 rounded-xl bg-gradient-to-r from-pink-500 to-red-500 text-white text-sm font-semibold hover:opacity-90 transition"
                            >
                                จองห้องประชุม
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
