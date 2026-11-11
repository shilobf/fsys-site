import { Component, HostListener, input, signal } from '@angular/core';
import { SiteContent } from '../../core/content.model';

@Component({
  selector: 'app-site-header',
  template: `
    <header
      class="fixed inset-x-0 top-0 z-50 transition-all duration-300"
      [class]="scrolled() || open() ? 'bg-ink/90 backdrop-blur-md border-b border-line' : 'bg-transparent'"
    >
      <div class="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 md:px-8">
        <a href="#top" class="flex items-center gap-3" [attr.aria-label]="company().name">
          <img [src]="company().logo" alt="" class="h-11 w-auto brightness-0 invert" />
        </a>

        <nav class="hidden items-center gap-8 text-[15px] lg:flex" aria-label="ניווט ראשי">
          @for (l of links; track l.href) {
            <a [href]="l.href" class="text-white/80 transition-colors hover:text-brand">{{ l.label }}</a>
          }
          <a href="#contact" class="btn-primary !px-5 !py-2 text-sm">צרו קשר</a>
        </nav>

        <button
          type="button"
          class="grid size-11 place-items-center lg:hidden"
          (click)="open.set(!open())"
          [attr.aria-expanded]="open()"
          aria-controls="mobile-nav"
          aria-label="תפריט"
        >
          <span class="relative block h-0.5 w-6 bg-white transition-all" [class.rotate-45]="open()"
            ><span
              class="absolute inset-x-0 h-0.5 bg-white transition-all"
              [class]="open() ? 'top-0 -rotate-90' : '-top-2'"
            ></span
            ><span class="absolute inset-x-0 top-2 h-0.5 bg-white transition-all" [class.opacity-0]="open()"></span
          ></span>
        </button>
      </div>

      @if (open()) {
        <nav id="mobile-nav" class="border-t border-line px-4 pb-6 lg:hidden" aria-label="ניווט ראשי">
          @for (l of links; track l.href) {
            <a [href]="l.href" (click)="open.set(false)" class="block border-b border-line/60 py-4 text-lg">{{
              l.label
            }}</a>
          }
          <a href="#contact" (click)="open.set(false)" class="btn-primary mt-6 w-full">צרו קשר</a>
        </nav>
      }
    </header>
  `,
})
export class SiteHeader {
  readonly company = input.required<SiteContent['company']>();
  protected readonly scrolled = signal(false);
  protected readonly open = signal(false);

  protected readonly links = [
    { href: '#about', label: 'אודות' },
    { href: '#capabilities', label: 'תחומי ליבה' },
    { href: '#process', label: 'מקצה לקצה' },
    { href: '#products', label: 'מוצרים' },
  ];

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled.set(window.scrollY > 40);
  }
}
