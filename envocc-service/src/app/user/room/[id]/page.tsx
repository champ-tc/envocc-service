'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameDay, isSameMonth } from 'date-fns'
import Image from 'next/image'

interface Room {
    id: string
    name: string
    description: string
    imageUrl: string
    capacity: number
}

interface Booking {
    id: string
    meetingTitle: string
    meetingChair: string
    attendees: number
    dateStart: string
    startTime: string
    endTime: string
}

export default function RoomBookingPage() {
    const { id } = useParams()
    const [room, setRoom] = useState<Room | null>(null)
    const [bookings, setBookings] = useState<Booking[]>([])
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date())

    useEffect(() => {
        const fetchRoom = async () => {
            const res = await fetch(`/api/room/${id}`)
            const data = await res.json()
            setRoom(data)
            setBookings(data.bookings)
        }
        fetchRoom()
    }, [id])

    const renderHeader = () => (
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">ระบบจองห้องประชุม</h1>
            <div>
                <button onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}>←</button>
                <span className="mx-4">{format(currentMonth, 'MMMM yyyy')}</span>
                <button onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}>→</button>
            </div>
        </div>
    )

    const renderCalendar = () => {
        const startDate = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 })
        const endDate = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 0 })

        const weeks = []
        let current = startDate

        while (current <= endDate) {
            const days = []
            for (let i = 0; i < 7; i++) {
                const day = current
                const bookingsToday = bookings.filter(b =>
                    isSameDay(new Date(b.dateStart), day)
                )

                days.push(
                    <div
                        key={day.toString()}
                        onClick={() => setSelectedDate(day)}
                        className={`border p-2 text-center cursor-pointer ${isSameDay(day, selectedDate) ? 'bg-blue-100' : ''} ${!isSameMonth(day, currentMonth) ? 'text-gray-400' : ''}`}
                    >
                        {format(day, 'd')}
                        {bookingsToday.length > 0 && (
                            <div className="text-xs text-green-600 mt-1">{bookingsToday.length} รายการ</div>
                        )}
                    </div>
                )
                current = addDays(current, 1)
            }

            weeks.push(<div className="grid grid-cols-7 gap-2" key={current.toString()}>{days}</div>)
        }

        return <div className="space-y-2">{weeks}</div>
    }

    const renderBookingList = () => {
        const dayBookings = bookings.filter(b => isSameDay(new Date(b.dateStart), selectedDate))
        if (dayBookings.length === 0) return <p className="text-gray-500">ไม่มีกำหนดการประชุมในวันนี้</p>

        return (
            <ul className="space-y-2">
                {dayBookings.map(b => (
                    <li key={b.id} className="border p-2 rounded shadow">
                        <div className="font-bold">{b.meetingTitle}</div>
                        <div className="text-sm">ประธาน: {b.meetingChair}</div>
                        <div className="text-sm">ผู้เข้าร่วม: {b.attendees} คน</div>
                        <div className="text-sm">เวลา: {b.startTime} - {b.endTime}</div>
                    </li>
                ))}
            </ul>
        )
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            {renderHeader()}

            {room && (
                <div className="mb-4">
                    <div className="flex gap-4">
                        <Image src={room.imageUrl} alt={room.name} width={100} height={80} className="rounded object-cover" />
                        <div>
                            <h2 className="text-lg font-semibold">{room.name}</h2>
                            <p className="text-sm text-gray-600">{room.description}</p>
                            <p className="text-sm">รองรับ {room.capacity} คน</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white p-4 rounded shadow mb-6">
                <h3 className="font-semibold mb-2">เลือกวัน</h3>
                {renderCalendar()}
            </div>

            <div className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold mb-2">การประชุมวันที่ {format(selectedDate, 'dd/MM/yyyy')}</h3>
                {renderBookingList()}
            </div>
        </div>
    )
}
