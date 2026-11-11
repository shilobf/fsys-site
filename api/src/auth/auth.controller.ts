import { Body, Controller, HttpCode, Post, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { timingSafeEqual } from 'node:crypto';

@Controller('auth')
export class AuthController {
  constructor(private readonly jwt: JwtService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: { password?: string }) {
    const expected = process.env.ADMIN_PASSWORD;
    const given = body?.password ?? '';
    if (!expected || !safeEqual(given, expected)) throw new UnauthorizedException('סיסמה שגויה');
    return { token: await this.jwt.signAsync({ role: 'admin' }) };
  }
}

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}
