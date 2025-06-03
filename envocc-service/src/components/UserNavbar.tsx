'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function UserNavbar() {
    const router = useRouter()

    const logout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' })
        router.push('/') // ✅ กลับไปหน้าแรก
    }


    return (
        <nav className="navbar">
            <button onClick={() => router.push('/user/main')}>
                <Image src="/icons/home.png" alt="Home" width={32} height={32} />
            </button>
            <h6>EnvOcc Service</h6>
            <button onClick={logout}>
                <Image src="/icons/logout.png" alt="Logout" width={32} height={32} />
            </button>
        </nav>
    )
}
