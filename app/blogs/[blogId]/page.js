'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import BlogSkeleton from '@/app/components/BlogSkeleton'
import { useSession } from 'next-auth/react'
import Image from 'next/image'

export default function BlogPage() {
    const { blogId } = useParams()
    const router = useRouter()
    const [blog, setBlog] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const { data: session } = useSession()


    const [hoveredRating, setHoveredRating] = useState(0)
    const [reviews, setReviews] = useState([])
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [submitting, setSubmitting] = useState(false)

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

        const fetchBlog = async () => {
            setLoading(true)
            try {
                const res = await axios.get(`/api/blogs/${blogId}`)
                setBlog(res.data)
                const rev = await axios.get(`/api/blogs/${blogId}/reviews/`)
                setReviews(rev.data)
            } catch (err) {
                console.error('Error loading blog:', err)
                setError(true)
            } finally {
                setLoading(false)
            }
        }

        fetchBlog()
    }, [blogId])

    const avgRating = reviews.length === 0 ? 0 : reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    if (loading) return <BlogSkeleton />
    if (error || !blog) {
        return (
            <div className="max-w-3xl mx-auto p-6 text-center text-red-600">
                Blog not found.
            </div>
        )
    }

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

            {/* ── AVERAGE RATING BAR ───────────────────── */}
            {reviews.length > 0 && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <div className="flex text-yellow-500">
                        {Array.from({ length: 5 }, (_, i) => (
                            <span key={i}>
                                {i < Math.round(avgRating) ? '★' : '☆'}
                            </span>
                        ))}
                    </div>
                    <span className="font-medium">
                        {avgRating.toFixed(1)} out of 5 &middot; {reviews.length}{' '}
                        {reviews.length === 1 ? 'review' : 'reviews'}
                    </span>
                </div>
            )}

            {blog.sections.map(sec => (
                <section key={sec._id} className="space-y-4">
                    <h2 className="text-2xl font-semibold">{sec.heading}</h2>
                    <div
                        className="text-gray-700"
                        dangerouslySetInnerHTML={{ __html: sec.content }}
                    />
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

            <section className="pt-10 border-t mt-10">
                <h2 className="text-2xl font-bold mb-4">Reviews</h2>

                {reviews.length === 0 ? (
                    <p className="text-gray-500">No reviews yet—be the first!</p>
                ) : (
                    <div className="space-y-4">
                        {reviews.map((rev, i) => (
                            <div
                                key={i}
                                className="p-4 bg-white shadow-sm rounded-lg hover:shadow-md transition-shadow"
                            >
                                <div className='flex justify-between'>
                                    <div className="flex items-center mb-2">
                                        <div className="flex text-yellow-500 mr-2">
                                            {Array.from({ length: 5 }, (_, k) => (
                                                <span key={k}>
                                                    {k < rev.rating ? '★' : '☆'}
                                                </span>
                                            ))}
                                        </div>
                                        <span className="text-sm text-gray-600">
                                            {rev.reviewerName}
                                        </span>
                                    </div>
                                    {session?.user?.id === rev.reviewerId && (
                                        <button
                                            onClick={async () => {
                                                try {
                                                    const res = await axios.delete(`/api/reviews/${rev._id}`)
                                                    if (res.status === 200) {
                                                        setReviews(prev => prev.filter(r => r._id !== rev._id))
                                                    } else {
                                                        alert(res.data?.error || 'Failed to delete review.')
                                                    }
                                                } catch (err) {
                                                    console.error('Delete error:', err)
                                                    const msg = err.response?.status === 401
                                                        ? 'You must be logged in to delete your review.'
                                                        : err.response?.status === 403
                                                            ? 'You can only delete your own review.'
                                                            : 'Something went wrong.'
                                                    alert(msg)
                                                }
                                            }}
                                            className="cursor-pointer"
                                        >
                                            <Image src={`/delete.svg`} alt="delete" width={20} height={20} />
                                        </button>

                                    )}
                                </div>
                                {rev.comment && (
                                    <p className="text-gray-800">{rev.comment}</p>
                                )}
                                <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                                    <time dateTime={rev.createdAt}>
                                        {new Date(rev.createdAt).toLocaleDateString()}
                                    </time>
                                    <span>•</span>
                                    <time dateTime={rev.createdAt}>
                                        {new Date(rev.createdAt).toLocaleTimeString()}
                                    </time>
                                </div>

                            </div>
                        ))}
                    </div>
                )}

                {session ? (
                    <div className="mt-6">
                        <div className="flex space-x-1 mb-2">
                            {[1, 2, 3, 4, 5].map(n => (
                                <button
                                    key={n}
                                    type="button"
                                    onMouseEnter={() => setHoveredRating(n)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    onClick={() => setRating(n)}                     // ← wire click to set rating
                                    className={`text-2xl cursor-pointer ${n <= (hoveredRating || rating)
                                        ? 'text-yellow-500'
                                        : 'text-gray-300'
                                        }`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                        <textarea
                            className="w-full border rounded p-2 mb-2"
                            placeholder="Share your thoughts (optional)…"
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                        />
                        <button
                            type="button"
                            disabled={submitting}
                            onClick={async () => {
                                setSubmitting(true)
                                try {
                                    const { data: newRev } = await axios.post(`/api/blogs/${blogId}/reviews/`, { rating, comment })
                                    setReviews([newRev, ...reviews])
                                    setRating(0)
                                    setComment('')
                                } catch (e) {
                                    console.error(e)
                                    alert('Error submitting review.')
                                } finally {
                                    setSubmitting(false)
                                }
                            }}
                            className="bg-dark-purple hover:bg-dark-purple/90 text-white py-2 px-4 rounded"
                        >
                            {submitting ? 'Submitting…' : 'Submit Review'}
                        </button>
                    </div>
                ) : (
                    <p className="mt-4 text-gray-500">
                        Please <a href={`/auth/login?callbackUrl=/blogs/${blogId}`} className="text-dark-purple hover:underline">log in</a> to post a review.
                    </p>
                )}
            </section>

        </article>
    )
}
