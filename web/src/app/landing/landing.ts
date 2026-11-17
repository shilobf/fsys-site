import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ContentService } from '../core/content.service';
import { SiteContent } from '../core/content.model';
import { SiteHeader } from './sections/site-header';
import { HeroSection } from './sections/hero-section';
import { AboutSection } from './sections/about-section';
import { CapabilitiesSection } from './sections/capabilities-section';
import { ProcessSection } from './sections/process-section';
import { ProductsSection } from './sections/products-section';
import { ContactSection } from './sections/contact-section';
import { SiteFooter } from './sections/site-footer';
import { StatsSection } from './sections/stats-section';
import { ConsultBar } from './sections/consult-bar';

@Component({
  selector: 'app-landing',
  imports: [
    SiteHeader,
    HeroSection,
    AboutSection,
    CapabilitiesSection,
    ProcessSection,
    ProductsSection,
    ContactSection,
    SiteFooter,
    StatsSection,
    ConsultBar,
  ],
  template: `
    @if (content(); as c) {
      <div class="bg-white text-fs-gray">
        <app-site-header [company]="c.company" />
        <main>
          <app-hero-section [hero]="c.hero" />
          <app-about-section [about]="c.about" />
          <app-capabilities-section [capabilities]="c.capabilities" />
          <app-products-section [products]="c.products" />
          <app-stats-section [stats]="c.stats" [background]="c.products.background" />
          <app-process-section [process]="c.process" />
          <app-contact-section [contact]="c.contact" />
        </main>
        <app-site-footer [company]="c.company" [contact]="c.contact" [capabilities]="c.capabilities" [products]="c.products" />
        <app-consult-bar />
      </div>
    } @else if (failed()) {
      <div class="grid min-h-screen place-items-center p-8 text-center">
        <div>
          <p class="eyebrow mb-4">F-SYS</p>
          <p class="text-xl">האתר אינו זמין כרגע. נסו שוב בעוד מספר דקות.</p>
        </div>
      </div>
    } @else {
      <div class="grid min-h-screen place-items-center">
        <div class="size-10 animate-spin rounded-full border-2 border-line border-t-brand"></div>
      </div>
    }
  `,
})
export class Landing {
  protected readonly content = signal<SiteContent | null>(null);
  protected readonly failed = signal(false);

  constructor() {
    inject(ContentService)
      .load()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (c) => this.content.set(c),
        error: () => this.failed.set(true),
      });
  }
}
