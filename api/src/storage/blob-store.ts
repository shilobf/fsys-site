import { Injectable } from '@nestjs/common';
import { GridFSBucket } from 'mongodb';
import { createReadStream } from 'node:fs';
import { mkdir, stat, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import type { Readable } from 'node:stream';
import { Mongo } from './mongo.js';

export interface Blob {
  stream: Readable;
  contentType: string;
  length: number;
}

const TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
};

/** Uploaded files: MongoDB GridFS (bucket `uploads`) when configured, else DATA_DIR/uploads. */
@Injectable()
export class BlobStore {
  private readonly dir = join(process.env.DATA_DIR ?? join(process.cwd(), 'data'), 'uploads');

  constructor(private readonly mongo: Mongo) {}

  async save(name: string, data: Buffer, contentType: string): Promise<void> {
    if (this.mongo.enabled) {
      const upload = (await this.bucket()).openUploadStream(name, { metadata: { contentType } });
      await new Promise<void>((resolve, reject) => upload.once('error', reject).end(data, () => resolve()));
      return;
    }
    await mkdir(this.dir, { recursive: true });
    await writeFile(join(this.dir, name), data);
  }

  async get(name: string): Promise<Blob | undefined> {
    const contentType = TYPES[extname(name)] ?? 'application/octet-stream';
    if (this.mongo.enabled) {
      const bucket = await this.bucket();
      const file = await bucket.find({ filename: name }).limit(1).next();
      if (!file) return undefined;
      return { stream: bucket.openDownloadStream(file._id), contentType, length: file.length };
    }
    const path = join(this.dir, name);
    try {
      const { size } = await stat(path);
      return { stream: createReadStream(path), contentType, length: size };
    } catch {
      return undefined;
    }
  }

  private async bucket() {
    return new GridFSBucket(await this.mongo.db(), { bucketName: 'uploads' });
  }
}
