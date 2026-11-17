import { Component, HostListener, input, signal } from '@angular/core';
import { SiteContent } from '../../core/content.model';

/** White bar so the full-color logo (gray wordmark) stays legible; gains a shadow once scrolled. */
@Component({
  selector: 'app-site-header',
  template: `
    <header
      class="fixed inset-x-0 top-0 z-50 bg-white/95 backdrop-blur transition-shadow duration-300"
      [class.shadow-lg]="scrolled() || open()"
    >
      <div class="h-1 bg-gradient-to-l from-fs-green via-fs-blue to-fs-blue"></div>
      <div class="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 md:px-8">
        <a href="#top" class="flex items-center" [attr.aria-label]="company().name">
          <img [src]="company().logo" alt="" class="h-12 w-auto" />
        </a>

        <nav class="hidden items-center gap-7 text-[15px] font-bold text-fs-gray lg:flex" aria-label="ניווט ראשי">
          @for (l of links; track l.href) {
            <a [href]="l.href" class="transition-colors hover:text-fs-blue">{{ l.label }}</a>
          }
          <a href="#contact" class="bg-brand px-4 py-1.5 text-white transition-colors hover:bg-fs-blue">צרו קשר</a>
        </nav>

        <button
          type="button"
          class="grid size-11 place-items-center text-fs-blue lg:hidden"
          (click)="open.set(!open())"
          [attr.aria-expanded]="open()"
          aria-controls="mobile-nav"
          aria-label="תפריט"
        >
          <span class="relative block h-0.5 w-6 bg-current transition-all" [class.rotate-45]="open()"
            ><span
              class="absolute inset-x-0 h-0.5 bg-current transition-all"
              [class]="open() ? 'top-0 -rotate-90' : '-top-2'"
            ></span
            ><span class="absolute inset-x-0 top-2 h-0.5 bg-current transition-all" [class.opacity-0]="open()"></span
          ></span>
        </button>
      </div>

      @if (open()) {
        <nav id="mobile-nav" class="border-t border-rule px-4 pb-6 text-fs-gray lg:hidden" aria-label="ניווט ראשי">
          @for (l of links; track l.href) {
            <a [href]="l.href" (click)="open.set(false)" class="block border-b border-rule py-4 text-lg font-bold">{{
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
    { href: '#products', label: 'קווי מוצרים' },
    { href: '#process', label: 'מקצה לקצה' },
  ];

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled.set(window.scrollY > 40);
  }
}
