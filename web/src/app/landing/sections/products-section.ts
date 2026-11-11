import { Component, input } from '@angular/core';
import { SiteContent } from '../../core/content.model';
import { RevealDirective } from '../../core/reveal.directive';

@Component({
  selector: 'app-products-section',
  imports: [RevealDirective],
  template: `
    <section id="products" class="relative isolate overflow-hidden py-24 md:py-32">
      <img [src]="products().background" alt="" class="absolute inset-0 -z-20 size-full object-cover" loading="lazy" />
      <div class="absolute inset-0 -z-10 bg-ink/85"></div>

      <div class="mx-auto max-w-7xl px-4 md:px-8">
        <div appReveal class="max-w-2xl">
          <p class="eyebrow mb-4">PRODUCTS</p>
          <h2 class="section-title">{{ products().title }}</h2>
          <p class="mt-4 text-lg text-white/70">{{ products().intro }}</p>
        </div>

        <div class="mt-14 grid gap-6 md:grid-cols-2">
          @for (p of products().items; track $index) {
            <article
              appReveal
              [appRevealDelay]="($index % 2) * 120"
              class="group grid overflow-hidden border border-white/10 bg-panel/80 backdrop-blur-sm transition-colors hover:border-brand/60 sm:grid-cols-[1fr_200px]"
            >
              <div class="p-7">
                <h3 class="text-2xl leading-snug font-bold">{{ p.title }}</h3>
                <p class="mt-3 text-white/75">{{ p.description }}</p>
                @if (p.bullets.length) {
                  <ul class="mt-5 space-y-2">
                    @for (b of p.bullets; track $index) {
                      <li class="flex gap-3 text-white/85">
                        <span class="mt-2 size-1.5 shrink-0 bg-brand" aria-hidden="true"></span>
                        <span>{{ b }}</span>
                      </li>
                    }
                  </ul>
                }
              </div>
              <div class="relative min-h-48 overflow-hidden bg-white">
                <img
                  [src]="p.image"
                  [alt]="p.title"
                  class="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            </article>
          }
        </div>
      </div>
    </section>
  `,
})
export class ProductsSection {
  readonly products = input.required<SiteContent['products']>();
}
