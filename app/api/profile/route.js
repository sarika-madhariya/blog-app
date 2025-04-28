// /app/api/profile/route.js
import connectDB from '@/app/lib/db';
import User from '@/app/model/User';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('id');

    if (!userId) {
        return new Response(JSON.stringify({ error: 'User ID (_id) is required' }), { status: 400 });
    }

    await connectDB();

    try {
        const user = await User.findById(userId);

        if (!user) {
            return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
        }

        return new Response(
            JSON.stringify({
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    emailId: user.emailId,
                },
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching user:', error);
        return new Response(JSON.stringify({ error: 'Invalid user ID format' }), { status: 400 });
    }
}
