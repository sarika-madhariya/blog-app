import { NextResponse } from 'next/server'
import connectDB from '@/app/lib/db'
import BlogPost from '@/app/model/Blog'
import cloudinary from '@/app/lib/cloudinary'
import { v4 as uuidv4 } from 'uuid'
import compressAndConvert from '@/app/lib/compressAndConvert'

export async function POST(request) {
    try {
        await connectDB()
        const body = await request.json()
        const { title, category, author, sections } = body

        if (!title || !category || !author || !sections?.length) {
            return NextResponse.json({ message: 'Invalid blog data.' }, { status: 400 })
        }

        // Helper to upload a single base64 image to Cloudinary
        const uploadBase64 = async (base64Str) => {
            try {
                const res = await cloudinary.v2.uploader.upload(base64Str, {
                    folder: 'blogs', // or `blogs/${blogId}` if you want per-blog folders
                })
                return res.secure_url
            } catch (err) {
                console.error('Cloudinary upload error:', err)
                return null
            }
        }

        // First generate blogId so you can namespace uploads if desired
        const blogId = uuidv4()

        // Upload each section.image (if present) to Cloudinary
        const updatedSections = await Promise.all(
            sections.map(async (sec) => {
                let url = null
                if (sec.image) {
                    url = await uploadBase64(sec.image)
                }
                return {
                    heading: sec.heading,
                    content: sec.content,
                    image: url, // secure URL or null
                }
            })
        )

        // Save document with URLs only
        const blog = new BlogPost({
            blogId,
            title,
            category,
            author,
            sections: updatedSections,
        })

        await blog.save()
        return NextResponse.json({ message: 'Blog created successfully', blog }, { status: 201 })

    } catch (error) {
        console.error('Error creating blog:', error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}
