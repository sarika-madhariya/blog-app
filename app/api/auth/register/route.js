import { NextResponse } from "next/server";
import User from "@/app/model/User";
import connectDB from "@/app/lib/db";
import bcrypt from "bcryptjs";

/**
 * Handles user registration
 * @param {Request} req - The request object
 * @returns {Response} - JSON response with success or error message
 */

export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();
        const { emailId, password, firstName, lastName } = body;

        // 🚨 Validate required fields
        if (!emailId || !password || !firstName || !lastName) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await User.findOne({ emailId }).lean();
        if (existingUser) {
            return NextResponse.json(
                { error: "Email already registered!" },
                { status: 409 }
            );
        }

        // Hash password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save user
        const newUser = new User({ ...body, password: hashedPassword });
        await newUser.save();

        return NextResponse.json(
            { message: "User registered successfully!", user: newUser.fullName },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration Error:", error);
        return NextResponse.json(
            { error: "Registration failed!", details: error.message },
            { status: 500 }
        );
    }
}

/**
 * Fetches all users
 */
export async function GET() {
    try {
        await connectDB();
        const users = await User.find({}).lean();
        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch users", details: error.message },
            { status: 500 }
        );
    }
}

/**
 * Updates a user by ID
 */
export async function PUT(req) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { error: "User ID is required!" },
                { status: 400 }
            );
        }

        const updatedData = await req.json();

        // If password is provided, hash it
        if (updatedData.password) {
            updatedData.password = await bcrypt.hash(updatedData.password, 10);
        } else {
            // If password field is empty, remove it to avoid overwriting
            delete updatedData.password;
        }

        const updatedUser = await User.findByIdAndUpdate(id, updatedData, {
            new: true,
            runValidators: true,
        }).lean();

        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(
            { message: "User updated successfully", user: updatedUser },
            { status: 200 }
        );
    } catch (error) {
        console.error('User update error:', error);
        return NextResponse.json(
            { error: "Failed to update user", details: error.message },
            { status: 500 }
        );
    }
}
/**
 * Deletes a user by ID
 */
export async function DELETE(req) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { error: "User ID is required!" },
                { status: 400 }
            );
        }

        const deletedUser = await User.findByIdAndDelete(id).lean();
        if (!deletedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(
            { message: "User deleted successfully!" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to delete user", details: error.message },
            { status: 500 }
        );
    }
}
