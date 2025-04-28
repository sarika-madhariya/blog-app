'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import CategorySkeleton from '@/app/components/CategrySkeleton'

export default function MyBlogsPage() {
    const { data: session, status } = useSession()
    const [blogs, setBlogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        if (status !== 'authenticated') return

        const fetchMyBlogs = async () => {
            try {
                setLoading(true)
                const res = await fetch(`/api/blogs/my-blogs/${session.user.id}`)
                if (!res.ok) throw new Error()
                const data = await res.json()
                setBlogs(data.blogs || [])
            } catch (err) {
                console.error(err)
                setError(true)
            } finally {
                setLoading(false)
            }
        }

        fetchMyBlogs()
    }, [session, status])

    if (status === 'loading' || loading) return <CategorySkeleton />
    if (error) return <p className="text-center text-red-600 mt-8">Failed to load your posts.</p>
    if (blogs.length === 0) {
        return <p className="text-center text-gray-700 mt-8">You have not written any blogs yet.</p>
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold">My Blogs</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {blogs.map((b) => (
                    <Link key={b.blogId} href={`/blogs/${b.blogId}`} className="block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                        {b.sections[0]?.image ? (
                            <div className="relative w-full h-48">
                                <Image
                                    src={b.sections[0].image}
                                    alt={b.sections[0].heading || b.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ) : (
                            <div className="w-full h-48 bg-gray-200" />
                        )}
                        <div className="p-4">
                            <h2 className="text-xl font-semibold">{b.title}</h2>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
