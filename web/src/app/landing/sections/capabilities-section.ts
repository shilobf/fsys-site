import { Component, input } from '@angular/core';
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
              </div>
            </article>
          }
        </div>
      </div>
    </section>
  `,
})
export class CapabilitiesSection {
  readonly capabilities = input.required<SiteContent['capabilities']>();
}
