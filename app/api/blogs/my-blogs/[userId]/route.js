import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import BlogPost from '@/app/model/BlogPost';

/**
 * Fetch blogs written by a specific user
 */
export async function GET(req, { params }) {
    try {
        await connectDB();
        const { userId } = params;

        if (!userId) {
            return NextResponse.json(
                { error: "User ID is required!" },
                { status: 400 }
            );
        }

        // Find all blogs where the 'author' matches the userId
        const blogs = await BlogPost.find({ author: userId }).lean();

        return NextResponse.json(
            { message: "Blogs fetched successfully", blogs },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching user's blogs:", error);
        return NextResponse.json(
            { error: "Failed to fetch blogs", details: error.message },
            { status: 500 }
        );
    }
}
