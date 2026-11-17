import { Component, inject, input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SiteContent } from '../../core/content.model';
import { RevealDirective } from '../../core/reveal.directive';

@Component({
  selector: 'app-capabilities-section',
  imports: [RevealDirective],
  template: `
    <section id="capabilities" class="relative bg-white pb-20 md:pb-28">
      <div class="mx-auto max-w-7xl px-4 md:px-8">
        <div appReveal class="-translate-y-1/2 text-center">
          <h2 class="chip">{{ capabilities().title }}</h2>
        </div>
        <p appReveal class="mx-auto max-w-2xl text-center text-lg text-fs-gray">{{ capabilities().intro }}</p>

        <div class="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-4">
          @for (item of capabilities().items; track $index) {
            <article appReveal [appRevealDelay]="$index * 100" class="group flex flex-col">
              <div class="relative aspect-[4/3] overflow-hidden bg-surface">
                <img
                  [src]="item.image"
                  [alt]="item.title"
                  class="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <span class="font-latin absolute top-0 start-0 bg-fs-blue px-2.5 py-1 text-sm font-bold text-white">0{{ $index + 1 }}</span>
              </div>
              <h3 class="mt-6 min-h-[2lh] text-2xl leading-snug font-bold text-fs-blue">{{ item.title }}</h3>
              <div class="mt-3 h-[3px] w-full bg-fs-green transition-all"></div>
              <p class="mt-4 font-bold text-fs-gray">{{ item.subtitle }}</p>
              <p class="mt-1 text-fs-gray/80">{{ item.steps }}</p>
              @if (simUrl(item.simulation)) {
                <a [href]="'#sim-' + $index" class="link-more mt-4 text-sm">
                  <span class="font-latin border border-current px-1.5 text-[11px]">3D</span> להדמיה התלת-ממדית ↓
                </a>
              }
            </article>
          }
        </div>

        @for (item of capabilities().items; track $index) {
          @if (simUrl(item.simulation); as url) {
            <div
              [id]="'sim-' + $index"
              appReveal
              class="mt-20 grid overflow-hidden bg-fs-navy text-white shadow-xl lg:grid-cols-[1fr_2fr]"
            >
              <div class="flex flex-col justify-center p-8 lg:p-10">
                <p class="font-latin mb-4 text-xs font-bold tracking-[0.3em] text-brand">INTERACTIVE 3D</p>
                <h3 class="text-3xl leading-tight font-bold">{{ item.title }}</h3>
                <p class="mt-3 text-lg text-white/80">{{ item.subtitle }}</p>
                <p class="mt-2 text-white/60">{{ item.steps }}</p>
                <ul class="mt-8 space-y-3 text-sm text-white/75">
                  <li class="flex gap-3"><span class="mt-1.5 size-1.5 shrink-0 bg-brand" aria-hidden="true"></span>העבירו את העכבר מעל המחולל כדי לפרק אותו למכלולים</li>
                  <li class="flex gap-3"><span class="mt-1.5 size-1.5 shrink-0 bg-brand" aria-hidden="true"></span>גררו כדי לסובב, גלגלו כדי להתקרב</li>
                  <li class="flex gap-3"><span class="mt-1.5 size-1.5 shrink-0 bg-brand" aria-hidden="true"></span>במסך מגע: הקשה מפרקת ומרכיבה</li>
                </ul>
                <a [href]="item.simulation" target="_blank" rel="noopener" class="mt-8 text-sm font-bold text-brand hover:underline">פתיחה במסך מלא ↗</a>
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
