import { FastifyReply } from 'fastify';

export function setAuthCookie(res: FastifyReply, token: string) {
  res.setCookie('pilot_token', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
  });
}
