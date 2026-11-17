import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { randomUUID } from 'node:crypto';
import multer from 'multer';
import { AdminGuard } from '../auth/admin.guard.js';
import { BlobStore } from '../storage/blob-store.js';

// SVG is deliberately excluded: it can carry scripts.
const ALLOWED = new Map([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
  ['image/gif', '.gif'],
]);
const SAFE_NAME = /^[a-f0-9-]{36}\.(jpg|png|webp|gif)$/;

@Controller('uploads')
export class UploadsController {
  constructor(private readonly blobs: BlobStore) {}

  @Post()
  @UseGuards(AdminGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => cb(null, ALLOWED.has(file.mimetype)),
    }),
  )
  async upload(@UploadedFile() file?: Express.Multer.File) {
    if (!file) throw new BadRequestException('יש להעלות קובץ תמונה (JPG, PNG, WEBP או GIF) עד 10MB');
    const name = randomUUID() + ALLOWED.get(file.mimetype);
    await this.blobs.save(name, file.buffer, file.mimetype);
    return { url: `/api/uploads/${name}` };
  }

  @Get(':name')
  async serve(@Param('name') name: string, @Res() res: Response) {
    if (!SAFE_NAME.test(name)) throw new NotFoundException();
    const blob = await this.blobs.get(name);
    if (!blob) throw new NotFoundException();
    res.set({
      'Content-Type': blob.contentType,
      'Content-Length': String(blob.length),
      'Cache-Control': 'public, max-age=2592000, immutable',
      'X-Content-Type-Options': 'nosniff',
    });
    blob.stream.on('error', () => res.destroy()).pipe(res);
  }
}
