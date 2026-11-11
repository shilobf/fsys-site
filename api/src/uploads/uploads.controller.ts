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
import { mkdirSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { join } from 'node:path';
import multer from 'multer';
import { AdminGuard } from '../auth/admin.guard.js';

const UPLOAD_DIR = join(process.env.DATA_DIR ?? join(process.cwd(), 'data'), 'uploads');
mkdirSync(UPLOAD_DIR, { recursive: true });

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
  @Post()
  @UseGuards(AdminGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.diskStorage({
        destination: UPLOAD_DIR,
        filename: (_req, file, cb) => cb(null, randomUUID() + ALLOWED.get(file.mimetype)),
      }),
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => cb(null, ALLOWED.has(file.mimetype)),
    }),
  )
  upload(@UploadedFile() file?: Express.Multer.File) {
    if (!file) throw new BadRequestException('יש להעלות קובץ תמונה (JPG, PNG, WEBP או GIF) עד 10MB');
    return { url: `/api/uploads/${file.filename}` };
  }

  @Get(':name')
  serve(@Param('name') name: string, @Res() res: Response) {
    if (!SAFE_NAME.test(name)) throw new NotFoundException();
    res.sendFile(name, { root: UPLOAD_DIR, maxAge: '30d', immutable: true }, (err) => {
      if (err && !res.headersSent) res.status(404).end();
    });
  }
}
