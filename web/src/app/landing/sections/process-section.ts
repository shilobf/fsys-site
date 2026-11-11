import { Component, input } from '@angular/core';
import { SiteContent } from '../../core/content.model';
import { RevealDirective } from '../../core/reveal.directive';

@Component({
  selector: 'app-process-section',
  imports: [RevealDirective],
  template: `
    <section id="process" class="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-32">
      <div appReveal class="max-w-2xl">
        <p class="eyebrow mb-4">END TO END</p>
        <h2 class="section-title">{{ process().title }}</h2>
      </div>

      <div class="relative mt-16">
      <div
        aria-hidden="true"
        class="absolute top-0 bottom-0 start-[19px] w-px bg-gradient-to-b from-brand via-signal to-transparent lg:top-[19px] lg:bottom-auto lg:start-0 lg:end-0 lg:h-px lg:w-auto lg:bg-gradient-to-l"
      ></div>
      <ol class="relative grid gap-8 lg:grid-cols-7 lg:gap-4">
        @for (step of process().steps; track $index) {
          <li appReveal [appRevealDelay]="$index * 90" class="relative flex items-start gap-5 lg:flex-col lg:gap-6">
            <span
              class="font-latin relative grid size-10 shrink-0 place-items-center border border-brand bg-ink text-sm font-semibold text-brand"
              >{{ $index + 1 }}</span
            >
            <span class="pt-2 text-lg leading-snug font-medium lg:pt-0">{{ step }}</span>
          </li>
        }
      </ol>
      </div>
    </section>
  `,
})
export class ProcessSection {
  readonly process = input.required<SiteContent['process']>();
}
