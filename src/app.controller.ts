import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Get a welcome message' })
  @ApiResponse({ status: 200, description: 'Returns a welcome message.' })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Returns OK if the server is healthy.',
  })
  @Get('/health')
  healthCheck(): string {
    return 'ok';
  }

  @Get('/html-test')
  async getHtmlPage(@Res() reply: FastifyReply) {
    reply.header('content-type', 'text/html').send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>NestJS + Fastify HTML Test</title>
        </head>
        <body>
          <h1>Login Test Page</h1>
          <button onclick="login()">Login</button>
          <button onclick="getUser()">Get User Info</button>

          <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
          <script>
            async function login() {
              try {
                const res = await axios.post('http://localhost:8000/api/v1/auth/login', {
                  email: 'saravana@pingpilot.com',
                  password: '12345678'
                }, {
                  withCredentials: true
                });
                console.log('Login response:', res.data);
              } catch (err) {
                console.error('Login failed:', err);
              }
            }

            async function getUser() {
              try {
                const res = await axios.get('http://localhost:8000/api/v1/user/me', {
                  withCredentials: true
                });
                console.log('User info:', res.data);
              } catch (err) {
                console.error('Get user failed:', err);
              }
            }
          </script>
        </body>
        </html>
      `);
  }
}
