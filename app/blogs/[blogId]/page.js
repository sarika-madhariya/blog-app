// app/blog/[blogId]/page.jsx
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import BlogSkeleton from '@/app/components/BlogSkeleton'
import { useSession } from 'next-auth/react'

export default function BlogPage() {
    const { blogId } = useParams()
    const router = useRouter()
    const [blog, setBlog] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const { data: session } = useSession()

    // map your stored slugs → display names
    const categoryMap = {
        'food': 'Food',
        'fashion': 'Fashion',
        'travel': 'Travel',
        'health-and-wellness': 'Health & Wellness',
        'beauty': 'Beauty',
        'other': 'Other',
    }

    useEffect(() => {
        if (!blogId) return
        fetch(`/api/blogs/${blogId}`)
            .then(res => {
                if (!res.ok) throw new Error()
                return res.json()
            })
            .then(data => setBlog(data))
            .catch(() => setError(true))
            .finally(() => setLoading(false))
    }, [blogId])

    if (loading) return <BlogSkeleton />
    if (error || !blog) return (
        <div className="max-w-3xl mx-auto p-6 text-center text-red-600">
            Blog not found.
        </div>
    )

    // pick the pretty name (fallback to stored value if missing)
    const displayCategory = categoryMap[blog.category] || blog.category

    return (
        <article className="max-w-3xl mx-auto p-6 space-y-8">
            <h1 className="text-4xl font-bold">{blog.title}</h1>
            <div className="flex space-x-4 text-sm text-gray-500">
                <span>{displayCategory}</span>
                <span>•</span>
                <span>By {blog.authorName}</span>
                <span>•</span>
                <time dateTime={blog.createdAt}>
                    {new Date(blog.createdAt).toLocaleDateString()}
                </time>
            </div>

            {blog.sections.map(sec => (
                <section key={sec._id} className="space-y-4">
                    <h2 className="text-2xl font-semibold">{sec.heading}</h2>
                    <div
                        className="text-gray-700"
                        dangerouslySetInnerHTML={{ __html: sec.content }}
                    ></div>
                    {sec.image && (
                        <img
                            src={sec.image}
                            alt={sec.heading}
                            className="w-full rounded-md object-cover"
                        />
                    )}
                </section>
            ))}

            {session?.user?.id === blog.author && (
                <button
                    onClick={() => router.push(`/blogs/${blogId}/edit`)}
                    className="mt-6 bg-dark-purple hover:bg-dark-purple/90 transition-all cursor-pointer text-white py-2 px-4 rounded"
                >
                    Edit
                </button>
            )}
        </article>
    )
}
