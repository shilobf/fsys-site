import { Component, inject, input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SiteContent } from '../../core/content.model';
import { RevealDirective } from '../../core/reveal.directive';

@Component({
  selector: 'app-capabilities-section',
  imports: [RevealDirective],
  template: `
    <section id="capabilities" class="border-y border-line bg-panel py-24 md:py-32">
      <div class="mx-auto max-w-7xl px-4 md:px-8">
        <div appReveal class="max-w-2xl">
          <p class="eyebrow mb-4">CAPABILITIES</p>
          <h2 class="section-title">{{ capabilities().title }}</h2>
          <p class="mt-4 text-lg text-white/70">{{ capabilities().intro }}</p>
        </div>

        <div class="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          @for (item of capabilities().items; track $index) {
            <article
              appReveal
              [appRevealDelay]="$index * 100"
              class="group relative flex flex-col overflow-hidden border border-line bg-panel-2 transition-colors hover:border-brand/60"
            >
              <div class="relative aspect-[4/3] overflow-hidden bg-white">
                <img
                  [src]="item.image"
                  [alt]="item.title"
                  class="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-panel-2/70 to-transparent"></div>
              </div>
              <div class="flex flex-1 flex-col p-6">
                <span class="font-latin text-sm font-semibold text-brand">0{{ $index + 1 }}</span>
                <h3 class="mt-2 text-xl font-bold">{{ item.title }}</h3>
                <p class="mt-2 text-white/70">{{ item.subtitle }}</p>
                <p class="mt-auto pt-6 text-sm tracking-wide text-muted">{{ item.steps }}</p>
                @if (simUrl(item.simulation)) {
                  <a [href]="'#sim-' + $index" class="mt-4 inline-flex items-center gap-2 text-sm font-medium text-brand hover:text-white">
                    <span class="font-latin border border-brand px-1.5 text-[11px]">3D</span> להדמיה התלת-ממדית ↓
                  </a>
                }
              </div>
            </article>
          }
        </div>

        @for (item of capabilities().items; track $index) {
          @if (simUrl(item.simulation); as url) {
            <div
              [id]="'sim-' + $index"
              appReveal
              class="mt-16 grid overflow-hidden border border-line bg-panel-2 lg:grid-cols-[1fr_2fr]"
            >
              <div class="flex flex-col justify-center p-8 lg:p-10">
                <p class="eyebrow mb-4">INTERACTIVE 3D</p>
                <h3 class="text-3xl leading-tight font-bold">{{ item.title }}</h3>
                <p class="mt-3 text-lg text-white/75">{{ item.subtitle }}</p>
                <p class="mt-2 text-white/60">{{ item.steps }}</p>
                <ul class="mt-8 space-y-3 text-sm text-white/70">
                  <li class="flex gap-3"><span class="mt-1.5 size-1.5 shrink-0 bg-brand" aria-hidden="true"></span>העבירו את העכבר מעל המחולל כדי לפרק אותו למכלולים</li>
                  <li class="flex gap-3"><span class="mt-1.5 size-1.5 shrink-0 bg-brand" aria-hidden="true"></span>גררו כדי לסובב, גלגלו כדי להתקרב</li>
                  <li class="flex gap-3"><span class="mt-1.5 size-1.5 shrink-0 bg-brand" aria-hidden="true"></span>במסך מגע: הקשה מפרקת ומרכיבה</li>
                </ul>
                <a [href]="item.simulation" target="_blank" rel="noopener" class="adm-link mt-8">פתיחה במסך מלא ↗</a>
              </div>
              <iframe
                [src]="url"
                [title]="'הדמיה תלת-ממדית – ' + item.title"
                loading="lazy"
                class="aspect-[4/3] w-full border-0 bg-[#e7eaee] lg:aspect-auto lg:min-h-[560px]"
              ></iframe>
            </div>
          }
        }
      </div>
    </section>
  `,
})
export class CapabilitiesSection {
  readonly capabilities = input.required<SiteContent['capabilities']>();
  private readonly sanitizer = inject(DomSanitizer);
  private readonly urls = new Map<string, SafeResourceUrl>();

  /** Only same-origin paths (e.g. /sims/x.html) may be embedded. */
  protected simUrl(path: string | undefined): SafeResourceUrl | null {
    if (!path || !path.startsWith('/') || path.startsWith('//')) return null;
    let url = this.urls.get(path);
    if (!url) {
      url = this.sanitizer.bypassSecurityTrustResourceUrl(path);
      this.urls.set(path, url);
    }
    return url;
  }
}
