// app/api/blogs/route.js
import { NextResponse } from 'next/server'
import connectDB from '@/app/lib/db'
import BlogPost from '@/app/model/BlogPost'

export async function GET(request) {
    await connectDB()

    const { searchParams } = request.nextUrl
    const categoryParam = searchParams.get('category')

    const filter = {}
    if (categoryParam) {
        // Match the category field exactly, ignoring case
        filter.category = { $regex: `^${categoryParam}$`, $options: 'i' }
    }

    // Fetch matching blogs, newest first
    const blogs = await BlogPost.find(filter).sort({ createdAt: -1 })

    return NextResponse.json(blogs)
}
