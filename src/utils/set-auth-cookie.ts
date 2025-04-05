import { FastifyReply } from 'fastify';

export function setAuthCookie(res: FastifyReply, token: string) {
  res.setCookie('pilot_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none', // or 'lax' depending on frontend-host location
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}
