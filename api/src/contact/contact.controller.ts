import { BadRequestException, Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { AdminGuard } from '../auth/admin.guard.js';
import { JsonStore } from '../storage/json-store.js';

interface ContactMessage {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string;
}

@Controller('contact')
export class ContactController {
  constructor(private readonly store: JsonStore) {}

  @Post()
  @HttpCode(201)
  async create(@Body() body: Partial<ContactMessage>) {
    const name = clean(body?.name, 100);
    const email = clean(body?.email, 200);
    const message = clean(body?.message, 5000);
    if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new BadRequestException('נא למלא שם, אימייל תקין והודעה');
    }
    const msg: ContactMessage = {
      id: randomUUID(),
      name,
      email,
      message,
      company: clean(body?.company, 200) || undefined,
      phone: clean(body?.phone, 50) || undefined,
      createdAt: new Date().toISOString(),
    };
    const all = (await this.store.read<ContactMessage[]>('messages')) ?? [];
    all.push(msg);
    await this.store.write('messages', all);
    return { ok: true };
  }

  @Get()
  @UseGuards(AdminGuard)
  async list() {
    const all = (await this.store.read<ContactMessage[]>('messages')) ?? [];
    return all.slice().reverse();
  }
}

function clean(v: unknown, max: number): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}
