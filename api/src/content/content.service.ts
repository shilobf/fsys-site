import { Injectable } from '@nestjs/common';
import { JsonStore } from '../storage/json-store.js';
import { DEFAULT_CONTENT, type SiteContent } from './default-content.js';

@Injectable()
export class ContentService {
  constructor(private readonly store: JsonStore) {}

  async get(): Promise<SiteContent> {
    const saved = await this.store.read<SiteContent>('content');
    if (saved) return saved;
    await this.store.write('content', DEFAULT_CONTENT);
    return DEFAULT_CONTENT;
  }

  async replace(content: SiteContent): Promise<SiteContent> {
    await this.store.write('content', content);
    return content;
  }
}
