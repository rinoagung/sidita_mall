import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@utils/connection";

import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

const handler = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const { email, password } = credentials;


                const user = await prisma.users.findUnique({
                    where: { email },
                });

                if (!user) {
                    throw new Error("No user found with the email");
                }

                const isValidPassword = await bcrypt.compare(password, user.password);
                if (!isValidPassword) {
                    throw new Error("Invalid password");
                }

                return { id: user.id, email: user.email, name: user.name };
            },
        }),
    ],
    pages: {
        signIn: '/', // Custom login page
    },
    session: {
        strategy: "jwt", // Using JWT for session management
    },
    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
