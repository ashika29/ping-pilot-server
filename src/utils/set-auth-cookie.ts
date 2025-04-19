import { FastifyReply } from 'fastify';

export function setAuthCookie(res: FastifyReply, token: string) {
  res.setCookie('pilot_token', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
  });
}

export function setRefreshTokenCookie(res: FastifyReply, token: string) {
  res.setCookie('refresh_token', token, {
    httpOnly: true,
    path: '/refresh',
    maxAge: 7 * 24 * 60 * 60,
  });
}
