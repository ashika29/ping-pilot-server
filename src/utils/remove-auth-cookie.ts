import { FastifyReply } from 'fastify';

export function removeAuthCookie(res: FastifyReply) {
  res.clearCookie('pilot_token', {
    path: '/',
  });
}

export function removeRefreshTokenCookie(res: FastifyReply) {
  res.clearCookie('refresh_token', {
    path: '/',
  });
}
