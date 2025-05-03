// app/api/reviews/[reviewId]/route.js

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import connectDB from '@/app/lib/db'
import Review from '@/app/model/Review'

export async function PUT(request, { params }) {
    await connectDB()
    const { reviewId } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { rating, comment } = await request.json()
    if (!rating || rating < 1 || rating > 5) {
        return NextResponse.json({ error: 'Invalid rating' }, { status: 400 })
    }

    try {
        const review = await Review.findById(reviewId)
        if (!review) {
            return NextResponse.json({ error: 'Review not found' }, { status: 404 })
        }
        if (review.reviewerId.toString() !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        review.rating = rating
        review.comment = comment || ''
        await review.save()

        return NextResponse.json(review, { status: 200 })
    } catch (err) {
        console.error('Reviews PUT error:', err)
        return NextResponse.json({ error: 'Failed to update review' }, { status: 500 })
    }
}

export async function DELETE(request, { params }) {
    await connectDB()
    const { reviewId } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const review = await Review.findById(reviewId)
        if (!review) {
            return NextResponse.json({ error: 'Review not found' }, { status: 404 })
        }
        if (review.reviewerId.toString() !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        await Review.findByIdAndDelete(reviewId)
        return NextResponse.json({ message: 'Review deleted successfully' }, { status: 200 })
    } catch (err) {
        console.error('Reviews DELETE error:', err)
        return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 })
    }
}
