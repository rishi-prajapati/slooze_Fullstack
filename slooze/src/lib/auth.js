// src/lib/auth.js
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import dbConnect from './dbConnect';
import User from '@/models/User';
import { getToken } from "next-auth/jwt";

const ACCESS_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// Create tokens
export function signAccessToken(id) {
  return jwt.sign({ id }, ACCESS_SECRET, { expiresIn: '15m' });
}

export function signRefreshToken(id) {
  return jwt.sign({ id }, REFRESH_SECRET, { expiresIn: '7d' });
}

// Verify tokens
export function verifyAccessToken(token) {
  try {
    return jwt.verify(token, ACCESS_SECRET);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      console.warn('Access token expired');
    }
    return null;
  }
}

export function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, REFRESH_SECRET);
  } catch (err) {
    return null;
  }
}

// Authentication middleware
export async function authenticateRequest(req) {
  try {
    // Check Authorization header first
    const authHeader = req.headers.get('authorization');
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      const decoded = verifyAccessToken(token);
      if (decoded) {
        await dbConnect();
        const user = await User.findById(decoded.id).lean();
        if (user) return user;
      }
    }

    // Check NextAuth session cookies
    const sessionToken = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    if (sessionToken?.id) {
      await dbConnect();
      const user = await User.findById(sessionToken.id).lean();
      if (user) return user;
    }

    return null;
  } catch (err) {
    console.error('Authentication error:', err);
    return null;
  }
}

// Role-based access control
export function requireRole(role) {
  return (req, next) => {
    const user = req.user;
    if (!user || user.role !== role) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }
    return next();
  };
}