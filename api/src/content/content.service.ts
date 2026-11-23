import { Injectable, Logger, type OnApplicationBootstrap } from '@nestjs/common';
import { JsonStore } from '../storage/json-store.js';
import { DEFAULT_CONTENT, type SiteContent } from './default-content.js';

/**
 * One-time edits to content that was saved before a default changed. Each runs once per store
 * (its id is recorded in the `migrations` document), so later admin edits are never overridden.
 */
const MIGRATIONS: { id: string; apply: (c: SiteContent) => void }[] = [
  {
    id: '2026-11-hero-harness',
    apply: (c) => {
      if (c.hero.image === '/images/hero.jpg') c.hero.image = '/images/hero-harness.webp';
      const videos = (c.hero.videos ??= []);
      if (!videos.includes('/videos/harness-assembly.mp4')) videos.unshift('/videos/harness-assembly.mp4');
    },
  },
];

@Injectable()
export class ContentService implements OnApplicationBootstrap {
  private readonly log = new Logger(ContentService.name);

  constructor(private readonly store: JsonStore) {}

  async onApplicationBootstrap() {
    try {
      await this.migrate();
    } catch (err) {
      // Not fatal: the site keeps serving the saved content and the migration retries on next start.
      this.log.error(`Content migration failed: ${(err as Error).message}`);
    }
  }

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

  private async migrate() {
    const done = (await this.store.read<string[]>('migrations')) ?? [];
    const pending = MIGRATIONS.filter((m) => !done.includes(m.id));
    if (!pending.length) return;
    const content = await this.store.read<SiteContent>('content');
    // Fresh store: defaults are already current, so just mark everything as applied.
    if (content) {
      for (const m of pending) m.apply(content);
      await this.store.write('content', content);
    }
    await this.store.write('migrations', [...done, ...pending.map((m) => m.id)]);
    this.log.log(`Applied content migrations: ${pending.map((m) => m.id).join(', ')}`);
  }
}
