// src/app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcrypt';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '@/lib/auth';

export const authOptions = {
  session: { strategy: 'jwt' },
  providers: [
    CredentialsProvider({
      name: 'Email & Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        await dbConnect();
        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error('No user found');

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) throw new Error('Invalid credentials');

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          country: user.country
        };
      }
    })
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign-in
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.country = user.country;
        token.accessToken = signAccessToken(user.id);
        token.refreshToken = signRefreshToken(user.id);
      }
      
      // Rotate tokens on session update
      if (trigger === 'update') {
        const { id } = verifyRefreshToken(token.refreshToken) || {};
        if (id) {
          token.accessToken = signAccessToken(id);
          token.refreshToken = signRefreshToken(id);
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.country = token.country;
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      return session;
    }
  },

  pages: {
    signIn: '/auth/login',
    error: '/auth/login'
  },

  secret: process.env.NEXTAUTH_SECRET,
  
  // Secure cookie settings
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30 // 30 days
      }
    },
    callbackUrl: {
      name: "next-auth.callback-url",
      options: {
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production"
      }
    },
    csrfToken: {
      name: "next-auth.csrf-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production"
      }
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };