'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import CategorySkeleton from '@/app/components/CategrySkeleton'

export default function CategoryPage() {
    const { slug } = useParams()
    const [blogs, setBlogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        if (!slug) return

        setLoading(true)
        fetch(`/api/blogs?category=${encodeURIComponent(slug)}`)
            .then(res => {
                if (!res.ok) throw new Error()
                return res.json()
            })
            .then(data => {
                setBlogs(data)
            })
            .catch(() => {
                setError(true)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [slug])

    if (loading) return <CategorySkeleton />
    if (error) return <p className="text-center text-red-600 mt-8">Failed to load posts.</p>
    if (blogs.length === 0) {
        return <p className="text-center text-gray-700 mt-8">No posts found in “{slug}”.</p>
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold capitalize">{slug}</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {blogs.map((b) => (
                    <Link key={b.blogId} href={`/blogs/${b.blogId}`} className="block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                        {b.sections[0]?.image ? (
                            <div className="relative w-full h-48">
                                <Image
                                    src={b.sections[0].image}
                                    alt={b.sections[0].heading}
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
