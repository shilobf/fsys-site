import { Injectable } from '@nestjs/common';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * Document storage backed by JSON files in DATA_DIR.
 * Kept behind this small interface so it can later be swapped for MongoDB
 * (one collection per document name) without touching the controllers.
 */
@Injectable()
export class JsonStore {
  private readonly dir = process.env.DATA_DIR ?? join(process.cwd(), 'data');

  async read<T>(name: string): Promise<T | undefined> {
    try {
      return JSON.parse(await readFile(this.path(name), 'utf8')) as T;
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') return undefined;
      throw err;
    }
  }

  async write<T>(name: string, value: T): Promise<void> {
    await mkdir(this.dir, { recursive: true });
    const tmp = this.path(name) + '.tmp';
    await writeFile(tmp, JSON.stringify(value, null, 2), 'utf8');
    await rename(tmp, this.path(name));
  }

  private path(name: string) {
    return join(this.dir, `${name}.json`);
  }
}
