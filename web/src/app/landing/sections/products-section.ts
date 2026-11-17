import { Component, input } from '@angular/core';
import { SiteContent } from '../../core/content.model';
import { RevealDirective } from '../../core/reveal.directive';

/** Edge-to-edge strip of tall image tiles; hovering (or focusing) a tile reveals its details. */
@Component({
  selector: 'app-products-section',
  imports: [RevealDirective],
  template: `
    <section id="products" class="bg-surface pt-20 md:pt-28">
      <div appReveal class="mx-auto max-w-3xl px-4 text-center md:px-8">
        <h2 class="chip">{{ products().title }}</h2>
        <p class="mt-6 text-lg text-fs-gray">{{ products().intro }}</p>
      </div>

      <div class="mt-14 grid gap-1 bg-white sm:grid-cols-2 lg:grid-cols-4">
        @for (p of products().items; track $index) {
          <article
            tabindex="0"
            class="group relative isolate h-[380px] overflow-hidden bg-fs-deep outline-none md:h-[480px]"
          >
            <img
              [src]="p.image"
              [alt]="p.title"
              class="absolute inset-0 -z-20 size-full object-cover transition-transform duration-700 group-hover:scale-105 group-focus-visible:scale-105"
              loading="lazy"
            />
            <div
              class="absolute inset-0 -z-10 bg-gradient-to-t from-fs-deep/90 via-fs-deep/20 to-transparent transition-colors duration-500 group-hover:bg-fs-navy/85 group-focus-visible:bg-fs-navy/85"
            ></div>

            <div class="flex h-full flex-col justify-end p-6 text-white">
              <h3 class="self-start bg-fs-blue px-3 py-1 text-lg leading-snug font-bold">{{ p.title }}</h3>
              <div
                class="grid grid-rows-[0fr] opacity-0 max-lg:grid-rows-[1fr] max-lg:opacity-100 transition-all duration-500 group-hover:grid-rows-[1fr] group-hover:opacity-100 group-focus-visible:grid-rows-[1fr] group-focus-visible:opacity-100"
              >
                <div class="overflow-hidden">
                  <p class="mt-4 text-white/90">{{ p.description }}</p>
                  @if (p.bullets.length) {
                    <ul class="mt-3 space-y-2 text-sm text-white/85">
                      @for (b of p.bullets; track $index) {
                        <li class="flex gap-2">
                          <span class="mt-2 size-1.5 shrink-0 bg-brand" aria-hidden="true"></span>
                          <span>{{ b }}</span>
                        </li>
                      }
                    </ul>
                  }
                </div>
              </div>
              <span class="mt-4 h-[3px] w-10 bg-brand transition-all duration-500 group-hover:w-full" aria-hidden="true"></span>
            </div>
          </article>
        }
      </div>
    </section>
  `,
})
export class ProductsSection {
  readonly products = input.required<SiteContent['products']>();
}
