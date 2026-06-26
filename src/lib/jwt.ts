import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'bazaar360_super_secret_key_123456789_abcdef';

export interface AdminTokenPayload {
  userId: string;
  username: string;
  role: 'ADMIN';
}

export function signAdminToken(payload: AdminTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyAdminToken(token: string): AdminTokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminTokenPayload;
  } catch (error) {
    return null;
  }
}

export function getAdminUserFromRequest(request: NextRequest): AdminTokenPayload | null {
  const token = request.cookies.get('admin_token')?.value;
  if (!token) {
    // Also try Authorization header as fallback
    const authHeader = request.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const headerToken = authHeader.substring(7);
      return verifyAdminToken(headerToken);
    }
    return null;
  }
  return verifyAdminToken(token);
}
