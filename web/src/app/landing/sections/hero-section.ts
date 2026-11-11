import { Component, input } from '@angular/core';
import { SiteContent } from '../../core/content.model';

@Component({
  selector: 'app-hero-section',
  template: `
    <section id="top" class="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      <img
        [src]="hero().image"
        alt=""
        class="animate-kenburns absolute inset-0 -z-20 size-full object-cover"
        fetchpriority="high"
      />
      <div class="absolute inset-0 -z-10 bg-gradient-to-l from-ink via-ink/80 to-ink/20"></div>
      <div class="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-ink to-transparent"></div>

      <div class="mx-auto flex w-full max-w-7xl flex-1 items-center px-4 pt-28 pb-16 md:px-8">
        <div class="max-w-2xl">
          <p class="eyebrow mb-6">{{ hero().eyebrow }}</p>
          <h1 class="text-5xl leading-[1.05] font-extrabold md:text-7xl">{{ hero().title }}</h1>
          <p class="font-latin mt-6 text-sm font-semibold tracking-[0.25em] text-white/70 md:text-base" dir="ltr">
            {{ hero().tagline }}
          </p>
          <div class="mt-8 space-y-2 border-s-2 border-brand ps-5 text-lg text-white/85 md:text-xl">
            @for (line of hero().lines; track $index) {
              <p>{{ line }}</p>
            }
          </div>
          <div class="mt-10 flex flex-wrap gap-4">
            <a href="#capabilities" class="btn-primary">{{ hero().ctaPrimary }}</a>
            <a href="#contact" class="btn-ghost">{{ hero().ctaSecondary }}</a>
          </div>
        </div>
      </div>

      <div class="border-t border-white/10 bg-ink/60 backdrop-blur-sm">
        <dl class="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">
          @for (s of stats(); track $index) {
            <div class="border-white/10 px-4 py-6 md:px-8 [&:not(:last-child)]:border-e">
              <dt class="sr-only">{{ s.label }}</dt>
              <dd>
                <span class="font-latin block text-2xl font-bold text-brand md:text-3xl">{{ s.value }}</span>
                <span class="mt-1 block text-sm text-muted">{{ s.label }}</span>
              </dd>
            </div>
          }
        </dl>
      </div>
    </section>
  `,
})
export class HeroSection {
  readonly hero = input.required<SiteContent['hero']>();
  readonly stats = input.required<SiteContent['stats']>();
}
