import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import BlogPost from '@/app/model/BlogPost';
import cloudinary from '@/app/lib/cloudinary';
import slugify from 'slugify';

export async function PUT(request) {
    try {
        await connectDB();

        const body = await request.json();
        console.log(body)
        const { blogId, title, category, author, authorName, sections } = body;

        // Validate request data
        if (!blogId || !title || !category || !author || !authorName || !Array.isArray(sections) || sections.length === 0) {
            return NextResponse.json({ message: 'Invalid blog data.' }, { status: 400 });
        }

        // Find the existing blog
        const blog = await BlogPost.findOne({ blogId });
        if (!blog) {
            return NextResponse.json({ message: 'Blog not found.' }, { status: 404 });
        }

        // Generate a new slugified blog ID
        const newBlogId = slugify(title, { lower: true, strict: true, locale: 'en' });

        // Helper function to upload base64 images
        const uploadBase64Image = async (base64Str) => {
            try {
                const uploadResponse = await cloudinary.v2.uploader.upload(base64Str, {
                    folder: `blogs/${newBlogId}`,
                });
                return uploadResponse.secure_url;
            } catch (err) {
                console.error('Cloudinary upload error:', err);
                throw new Error('Image upload failed');
            }
        };

        // Prepare updated sections
        const updatedSections = await Promise.all(sections.map(async (section) => {
            let imageUrl = section.image;

            if (section.image?.startsWith('data:')) {
                // New base64 image needs uploading
                imageUrl = await uploadBase64Image(section.image);
            }

            return {
                heading: section.heading,
                content: section.content,
                image: imageUrl,
            };
        }));

        // Update blog fields
        blog.blogId = newBlogId;
        blog.title = title;
        blog.category = category;
        blog.author = author;
        blog.authorName = authorName;
        blog.sections = updatedSections;

        // Save the updated blog
        await blog.save();

        return NextResponse.json({ message: 'Blog updated successfully', blog }, { status: 200 });

    } catch (error) {
        console.error('Error updating blog:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
