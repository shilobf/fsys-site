import { Component, input } from '@angular/core';
import { SiteContent } from '../../core/content.model';
import { RevealDirective } from '../../core/reveal.directive';

@Component({
  selector: 'app-process-section',
  imports: [RevealDirective],
  template: `
    <section id="process" class="bg-white px-4 py-20 md:px-8 md:py-28">
      <div class="mx-auto max-w-7xl">
        <div appReveal class="text-center">
          <h2 class="chip">{{ process().title }}</h2>
          <p class="mt-6 text-lg text-fs-gray">כל שלבי הפרויקט תחת קורת גג אחת</p>
        </div>

        <div class="relative mt-16">
          <div
            aria-hidden="true"
            class="absolute top-0 bottom-0 start-[21px] w-[3px] bg-gradient-to-b from-fs-green to-fs-blue lg:top-[21px] lg:bottom-auto lg:start-0 lg:end-0 lg:h-[3px] lg:w-auto lg:bg-gradient-to-l"
          ></div>
          <ol class="relative grid gap-8 lg:grid-cols-7 lg:gap-4">
            @for (step of process().steps; track $index) {
              <li appReveal [appRevealDelay]="$index * 90" class="flex items-start gap-5 lg:flex-col lg:items-center lg:gap-5 lg:text-center">
                <span
                  class="font-latin grid size-[45px] shrink-0 place-items-center border-[3px] border-white bg-fs-blue text-base font-bold text-white shadow-[0_0_0_2px_var(--color-fs-green)]"
                  >{{ $index + 1 }}</span
                >
                <span class="pt-2.5 text-lg leading-snug font-bold text-fs-gray lg:pt-0">{{ step }}</span>
              </li>
            }
          </ol>
        </div>
      </div>
    </section>
  `,
})
export class ProcessSection {
  readonly process = input.required<SiteContent['process']>();
}
