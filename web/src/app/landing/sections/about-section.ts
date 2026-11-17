import { Component, computed, input, signal } from '@angular/core';
import { SiteContent } from '../../core/content.model';
import { RevealDirective } from '../../core/reveal.directive';

/** Centered intro block under a solid label, followed by a full-width image band. */
@Component({
  selector: 'app-about-section',
  imports: [RevealDirective],
  template: `
    <section id="about" class="bg-white px-4 py-20 md:px-8 md:py-28">
      <div appReveal class="mx-auto max-w-3xl text-center">
        <h2 class="chip">{{ about().title }}</h2>
        <p class="mt-8 text-xl leading-relaxed font-bold text-fs-blue md:text-2xl">{{ about().lead }}</p>
        <div class="mt-6 space-y-4 text-lg leading-relaxed text-fs-gray">
          @for (p of visible(); track $index) {
            <p>{{ p }}</p>
          }
        </div>
        @if (about().paragraphs.length > preview) {
          <button type="button" class="link-more mt-6" (click)="expanded.set(!expanded())" [attr.aria-expanded]="expanded()">
            {{ expanded() ? 'הצג פחות' : 'קראו עוד' }}
            <span aria-hidden="true">{{ expanded() ? '︿' : '‹' }}</span>
          </button>
        }
      </div>
    </section>

    <div class="relative h-[300px] overflow-hidden md:h-[460px]" aria-hidden="true">
      <img [src]="about().image" alt="" class="animate-kenburns size-full object-cover" loading="lazy" />
      <div class="absolute inset-0 bg-gradient-to-t from-fs-deep/40 to-transparent"></div>
    </div>
  `,
})
export class AboutSection {
  readonly about = input.required<SiteContent['about']>();
  protected readonly preview = 1;
  protected readonly expanded = signal(false);
  protected readonly visible = computed(() =>
    this.expanded() ? this.about().paragraphs : this.about().paragraphs.slice(0, this.preview),
  );
}
