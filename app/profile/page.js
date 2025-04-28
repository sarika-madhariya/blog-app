'use client'

import React, { useState, useEffect, useContext } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { GlobalContext } from '@/app/lib/GlobalContext'
import axios from 'axios'
import Image from 'next/image'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { setGlobalLoading } = useContext(GlobalContext)

  const [editMode, setEditMode] = useState(false)
  const [passwordMode, setPasswordMode] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    emailId: '',
    password: '',
    confirmPassword: '',
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setGlobalLoading(true)
        const res = await axios.get(`/api/profile?id=${session.user.id}`)
        if (res.status === 200) {
          const { user } = res.data
          setFormData({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            emailId: user.emailId || '',
            password: '',
            confirmPassword: '',
          })
        }
      } catch (error) {
        console.error('Failed to fetch profile', error)
      } finally {
        setGlobalLoading(false)
      }
    }

    if (status === 'authenticated' && session) {
      fetchProfile()
    } else if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, session, router, setGlobalLoading])

  if (status === 'loading') {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="loader"></div>
      </div>
    )
  }
  if (!session) return null

  const handleLogout = async () => {
    setGlobalLoading(true)
    await signOut({ redirect: false })
    router.push('/auth/login')
    setGlobalLoading(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = async () => {
    try {
      setGlobalLoading(true)
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
      }
      const res = await axios.put(`/api/auth/register?id=${session.user.id}`, updateData)
      if (res.status === 200) {
        alert('Profile updated successfully!')
        setEditMode(false)
      } else {
        alert(res.data.error || 'Failed to update profile')
      }
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.error || 'Something went wrong!')
    } finally {
      setGlobalLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!')
      return
    }
    if (formData.password.trim().length < 6) {
      alert('Password must be at least 6 characters long')
      return
    }
    try {
      setGlobalLoading(true)
      const updateData = {
        password: formData.password,
      }
      const res = await axios.put(`/api/auth/register?id=${session.user.id}`, updateData)
      if (res.status === 200) {
        alert('Password updated successfully!')
        setPasswordMode(false)
        setFormData((prev) => ({ ...prev, password: '', confirmPassword: '' }))
      } else {
        alert(res.data.error || 'Failed to update password')
      }
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.error || 'Something went wrong!')
    } finally {
      setGlobalLoading(false)
    }
  }

  return (
    <div className="bg-[url(/hero-bg.jpg)] bg-cover py-9">
      <div className="flex flex-col  backdrop-blur-sm gap-9 mx-auto px-16 py-9 bg-white/50 w-fit rounded-xl">
        <div className='flex  justify-between'>
          <div className='flex gap-4'>
            <h2 className="font-black text-3xl text-[#333333]">Your Profile</h2>
            {!passwordMode && (
              <div className='flex gap-4'>
                {!editMode ? (
                  <button onClick={() => setEditMode(true)} className='cursor-pointer'>
                    <Image src="/edit.svg" alt="edit" width={25} height={25} />
                  </button>
                ) : (
                  <div className='flex gap-4'>
                    <button onClick={handleSaveProfile} className='cursor-pointer'>
                      <Image src="/update.svg" alt="Update" width={25} height={25} />
                    </button>
                    <button onClick={() => setEditMode(false)} className='cursor-pointer'>
                      <Image src="/cancel.svg" alt="cancel edit" width={25} height={25} />
                    </button>
                  </div>
                )}
              </div>
            )}



          </div>
          <button onClick={handleLogout} className='cursor-pointer'>
            <Image src="/logout.svg" alt="logout" width={25} height={25} />
          </button>
        </div>
        <p className="text-gray-500 ">
          Manage your account information below.
        </p>

        {!passwordMode ? (
          <div className='flex flex-col gap-6'>
            <div className="flex flex-col gap-6 w-[400px]">
              {['firstName', 'lastName', 'emailId'].map((field) => (
                <div key={field} className="flex flex-col gap-2">
                  <label className="text-gray-600 text-sm">
                    {field === 'emailId'
                      ? 'Email ID'
                      : field === 'firstName'
                        ? 'First Name'
                        : 'Last Name'}
                  </label>
                  <input
                    type={field === 'emailId' ? 'email' : 'text'}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    disabled={field === 'emailId' || !editMode}
                    className={`border transition-all border-gray-600 rounded-md h-12 px-6 text-sm outline-none ${editMode && field != 'emailId' ? 'bg-gray-100 ' : ''} focus:bg-white`}
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4 w-full ">
              <button
                onClick={() => setPasswordMode(true)}
                className="w-full  bg-dark-purple hover:bg-dark-purple/90 cursor-pointer transition-all text-white py-2 rounded-md text-lg font-semibold"
              >
                Change Password
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Change Password Form */}
            <div className="flex flex-col gap-6 w-[400px]">
              {['password', 'confirmPassword'].map((field) => (
                <div key={field} className="flex flex-col gap-2">
                  <label className="text-gray-600 text-sm">
                    {field === 'password' ? 'New Password' : 'Confirm New Password'}
                  </label>
                  <input
                    type="password"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    placeholder={field === 'confirmPassword' ? 'Re-enter your new password' : ''}
                    className="border border-gray-600 outline-none rounded-md h-12 px-6 text-sm bg-gray-100 focus:bg-white"
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4 w-full ">
              <button
                onClick={handleChangePassword}
                className="w-full bg-dark-purple hover:bg-dark-purple/90 cursor-pointer transition-all text-white py-2 rounded-md text-lg font-semibold"
              >
                Save Password
              </button>
              <button
                onClick={() => {
                  setPasswordMode(false)
                  setFormData((prev) => ({ ...prev, password: '', confirmPassword: '' }))
                }}
                className="w-full bg-gray-500 hover:bg-gray-600 transition-all text-white py-2 rounded-md text-lg font-semibold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div >
  )
}
