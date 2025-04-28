// app/profile/page.jsx
'use client'

import React, { useContext, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { GlobalContext } from '@/app/lib/GlobalContext'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { setGlobalLoading } = useContext(GlobalContext)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className='fixed inset-0 flex items-center justify-center'>
        <div className='loader'></div>
      </div>
    )
  }

  if (!session) return null

  const onLogout = async () => {
    setGlobalLoading(true)
    await signOut({ redirect: false })
    router.push('/auth/login')
    setGlobalLoading(false)
  }

  const { firstName, lastName, email } = session.user

  return (
    <div className='bg-[url(/hero-bg.jpg)] bg-cover py-9'>
      <div className="flex flex-col items-center backdrop-blur-sm gap-9 mx-auto px-16 py-9 bg-white/50 w-fit rounded-xl">
        <div className="flex flex-col gap-4 items-center">
          <h2 className="font-black text-3xl text-[#333333]">
            Your Profile
          </h2>
          <p className="text-gray-500 text-center">
            Manage your account information below.
          </p>
        </div>

        {/* Profile Details */}
        <div className="flex flex-col gap-6 w-[400px]">
          <div className="flex flex-col gap-2">
            <label className="text-gray-600 text-sm">First Name</label>
            <input
              type="text"
              value={firstName}
              disabled
              className="border border-gray-600 bg-gray-100 rounded-md h-12 px-6 text-sm"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-600 text-sm">Last Name</label>
            <input
              type="text"
              value={lastName}
              disabled
              className="border border-gray-600 bg-gray-100 rounded-md h-12 px-6 text-sm"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-600 text-sm">Email</label>
            <input
              type="email"
              value={email}
              disabled
              className="border border-gray-600 bg-gray-100 rounded-md h-12 px-6 text-sm"
            />
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="w-full max-w-xs bg-dark-purple hover:bg-dark-purple/90 transition-all cursor-pointer text-white py-2 rounded-md text-lg font-semibold"
        >
          Logout
        </button>
      </div>
    </div>
  )
}
