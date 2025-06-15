// src/lib/apiClient.js
import { getSession } from 'next-auth/react';

export async function authFetch(url, options = {}) {
  const session = await getSession();
  
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${session?.accessToken}`,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Auto-refresh tokens on 401 errors
  if (response.status === 401 && session?.refreshToken) {
    await fetch('/api/auth/session?update=true', {
      method: 'POST',
      body: JSON.stringify({ refreshToken: session.refreshToken })
    });
    return authFetch(url, options); // Retry request
  }

  return response;
}