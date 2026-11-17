import { Component, input } from '@angular/core';
import { SiteContent } from '../../core/content.model';
import { RevealDirective } from '../../core/reveal.directive';

/** Blue band with large figures, decorated with gear outlines echoing the logo. */
@Component({
  selector: 'app-stats-section',
  imports: [RevealDirective],
  template: `
    <section class="relative isolate overflow-hidden bg-fs-blue py-20 text-white md:py-24" aria-label="נתונים">
      @if (background()) {
        <img [src]="background()" alt="" class="absolute inset-0 -z-20 size-full object-cover opacity-15 mix-blend-luminosity" loading="lazy" />
      }
      <svg class="absolute -start-24 top-1/2 -z-10 size-[420px] -translate-y-1/2 text-white/10" viewBox="0 0 200 200" aria-hidden="true">
        <g fill="none" stroke="currentColor" stroke-width="1.2">
          <circle cx="100" cy="100" r="62" /><circle cx="100" cy="100" r="38" /><circle cx="100" cy="100" r="14" />
          @for (a of teeth; track a) {
            <rect x="92" y="18" width="16" height="22" [attr.transform]="'rotate(' + a + ' 100 100)'" />
          }
        </g>
      </svg>
      <svg class="absolute -end-20 -bottom-28 -z-10 size-[360px] text-white/10" viewBox="0 0 200 200" aria-hidden="true">
        <g fill="none" stroke="currentColor" stroke-width="1.2">
          <circle cx="100" cy="100" r="90" /><circle cx="100" cy="100" r="66" /><circle cx="100" cy="100" r="30" />
          <circle cx="60" cy="70" r="16" /><circle cx="140" cy="80" r="12" /><circle cx="110" cy="150" r="18" />
        </g>
      </svg>

      <dl class="mx-auto grid max-w-6xl grid-cols-2 gap-y-12 px-4 md:grid-cols-4 md:px-8">
        @for (s of stats(); track $index) {
          <div appReveal [appRevealDelay]="$index * 100" class="flex flex-col-reverse items-center text-center">
            <dt class="mt-3 max-w-[14rem] text-base font-medium text-white/85 md:text-lg">{{ s.label }}</dt>
            <dd class="font-latin text-4xl font-extrabold md:text-5xl">{{ s.value }}</dd>
          </div>
        }
      </dl>
    </section>
  `,
})
export class StatsSection {
  readonly stats = input.required<SiteContent['stats']>();
  readonly background = input<string>('');
  protected readonly teeth = [0, 45, 90, 135, 180, 225, 270, 315];
}
