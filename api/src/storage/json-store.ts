import { Injectable } from '@nestjs/common';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Mongo } from './mongo.js';

interface Doc {
  _id: string;
  value: unknown;
}

/**
 * Named JSON documents (content, messages…).
 * MongoDB: one document per name in the `docs` collection. Otherwise: DATA_DIR/{name}.json.
 */
@Injectable()
export class JsonStore {
  private readonly dir = process.env.DATA_DIR ?? join(process.cwd(), 'data');
  /** Serializes file read-modify-write cycles within this process. */
  private fileLock: Promise<unknown> = Promise.resolve();

  constructor(private readonly mongo: Mongo) {}

  async read<T>(name: string): Promise<T | undefined> {
    if (this.mongo.enabled) {
      const doc = await (await this.docs()).findOne({ _id: name });
      return doc?.value as T | undefined;
    }
    return this.readFile<T>(name);
  }

  async write<T>(name: string, value: T): Promise<void> {
    if (this.mongo.enabled) {
      await (await this.docs()).replaceOne({ _id: name }, { value }, { upsert: true });
      return;
    }
    await this.locked(() => this.writeFile(name, value));
  }

  /** Atomically appends an item to an array document, creating it if needed. */
  async append<T>(name: string, item: T): Promise<void> {
    if (this.mongo.enabled) {
      await (await this.docs()).updateOne({ _id: name }, { $push: { value: item } } as never, { upsert: true });
      return;
    }
    await this.locked(async () => {
      const list = (await this.readFile<T[]>(name)) ?? [];
      list.push(item);
      await this.writeFile(name, list);
    });
  }

  private async docs() {
    return (await this.mongo.db()).collection<Doc>('docs');
  }

  private locked<R>(fn: () => Promise<R>): Promise<R> {
    const run = this.fileLock.then(fn, fn);
    this.fileLock = run.catch(() => undefined);
    return run;
  }

  private async readFile<T>(name: string): Promise<T | undefined> {
    try {
      return JSON.parse(await readFile(this.path(name), 'utf8')) as T;
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') return undefined;
      throw err;
    }
  }

  private async writeFile(name: string, value: unknown) {
    await mkdir(this.dir, { recursive: true });
    const tmp = this.path(name) + '.tmp';
    await writeFile(tmp, JSON.stringify(value, null, 2), 'utf8');
    await rename(tmp, this.path(name));
  }

  private path(name: string) {
    return join(this.dir, `${name}.json`);
  }
}
