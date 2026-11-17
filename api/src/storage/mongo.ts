import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { Db, MongoClient } from 'mongodb';

/**
 * Lazily connected MongoDB handle. Storage uses MongoDB when MONGODB_URI is set
 * (production on hosts without a persistent disk) and local files otherwise.
 */
@Injectable()
export class Mongo implements OnApplicationShutdown {
  private client?: MongoClient;
  private conn?: Promise<Db>;

  readonly enabled = !!process.env.MONGODB_URI;

  db(): Promise<Db> {
    if (!this.conn) {
      this.client = new MongoClient(process.env.MONGODB_URI!);
      this.conn = this.client.connect().then((c) => c.db(process.env.MONGODB_DB || 'fsys'));
      // Allow a retry on the next request if the first connection attempt fails.
      this.conn.catch(() => (this.conn = undefined));
    }
    return this.conn;
  }

  async onApplicationShutdown() {
    await this.client?.close();
  }
}
