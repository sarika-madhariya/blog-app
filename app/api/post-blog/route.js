import { NextResponse } from 'next/server'
import connectDB from '@/app/lib/db'
import BlogPost from '@/app/model/BlogPost'
import cloudinary from '@/app/lib/cloudinary'
import slugify from 'slugify'

export async function POST(request) {
    try {
        await connectDB()
        const body = await request.json()
        const { title, category, author, authorName, sections } = body

        if (!title || !category || !author || !authorName || !sections?.length) {
            return NextResponse.json({ message: 'Invalid blog data.' }, { status: 400 })
        }

        // Create a slug from the title, e.g. "This is my blog" → "this-is-my-blog"
        const blogId = slugify(title, {
            lower: true,
            strict: true,    // strips out non-word chars
            locale: 'en'
        })

        // Helper to upload a single base64 image to Cloudinary
        const uploadBase64 = async (base64Str) => {
            try {
                const res = await cloudinary.v2.uploader.upload(base64Str, {
                    folder: `blogs/${blogId}`, // optionally namespace by slug
                })
                return res.secure_url
            } catch (err) {
                console.error('Cloudinary upload error:', err)
                return null
            }
        }

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
                    image: url,
                }
            })
        )

        // Save document with URLs only
        const blog = new BlogPost({
            blogId,      // slugified title
            title,
            category,
            author,
            authorName,
            sections: updatedSections,
        })

        await blog.save()
        return NextResponse.json({ message: 'Blog created successfully', blogId }, { status: 201 })

    } catch (error) {
        console.error('Error creating blog:', error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}
