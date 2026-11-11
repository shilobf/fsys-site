import { BadRequestException, Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../auth/admin.guard.js';
import { ContentService } from './content.service.js';
import type { SiteContent } from './default-content.js';

@Controller('content')
export class ContentController {
  constructor(private readonly content: ContentService) {}

  @Get()
  get() {
    return this.content.get();
  }

  @Put()
  @UseGuards(AdminGuard)
  replace(@Body() body: SiteContent) {
    if (!body || typeof body !== 'object' || !body.hero || !body.contact) {
      throw new BadRequestException('Invalid content document');
    }
    return this.content.replace(body);
  }
}
