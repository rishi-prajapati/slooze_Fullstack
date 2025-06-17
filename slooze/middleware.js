import { NextResponse } from 'next/server';

export default function middleware(req) {
  const isProduction = process.env.NODE_ENV === "production";
  const host = req.headers.get("host");
  
  // Force HTTPS in production
  if (isProduction && req.nextUrl.protocol === "http:") {
    return NextResponse.redirect(`https://${host}${req.nextUrl.pathname}`);
  }
  
  return NextResponse.next();
}