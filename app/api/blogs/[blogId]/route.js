import { NextResponse } from 'next/server'
import connectDB from '@/app/lib/db'
import BlogPost from '@/app/model/BlogPost'

export async function GET(request, { params }) {
  await connectDB()
  const blog = await BlogPost.findOne({ blogId: params.blogId })
  if (!blog) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 })
  }
  return NextResponse.json(blog)
}
