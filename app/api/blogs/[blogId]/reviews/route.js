import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import connectDB from '@/app/lib/db'
import Review from '@/app/model/Review'

export async function GET(request, { params }) {
    await connectDB()
    // New App‑Router requires awaiting params
    const { blogId } = await params

    try {
        const reviews = await Review
            .find({ blogId })
            .sort({ createdAt: -1 })
            .lean()
        return NextResponse.json(reviews)
    } catch (err) {
        console.error('Reviews GET error:', err)
        return NextResponse.json(
            { error: 'Failed to fetch reviews' },
            { status: 500 }
        )
    }
}

export async function POST(request, { params }) {
    await connectDB()
    const { blogId } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        )
    }

    const { rating, comment } = await request.json()
    if (!rating || rating < 1 || rating > 5) {
        return NextResponse.json(
            { error: 'Invalid rating' },
            { status: 400 }
        )
    }

    try {
        const newReview = await Review.create({
            blogId,
            reviewerId: session.user.id,
            reviewerName: session.user.fullName || session.user.email,
            rating,
            comment: comment || '',
        })
        return NextResponse.json(newReview, { status: 201 })
    } catch (err) {
        console.error('Reviews POST error:', err)
        return NextResponse.json(
            { error: 'Failed to post review' },
            { status: 500 }
        )
    }
}
