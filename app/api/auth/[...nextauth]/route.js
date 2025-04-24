import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "@/app/lib/db";
import User from "@/app/model/User";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                emailId: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                await connectDB();
                const user = await User.findOne({ emailId: credentials.emailId });
                if (!user) throw new Error("Invalid email or password");

                const valid = await bcrypt.compare(credentials.password, user.password);
                if (!valid) throw new Error("Invalid email or password");

                return {
                    id: user._id.toString(),
                    email: user.emailId,
                    firstName: user.firstName,
                    lastName: user.lastName,
                };
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: "jwt" },
    pages: { signIn: "/login" },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.firstName = user.firstName;
                token.lastName = user.lastName;
                token.fullName = `${user.firstName} ${user.lastName}`;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id;
            session.user.firstName = token.firstName;
            session.user.lastName = token.lastName;
            session.user.fullName = token.fullName;
            return session;
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
