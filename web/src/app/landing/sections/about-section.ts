import { Component, computed, input, signal } from '@angular/core';
import { SiteContent } from '../../core/content.model';
import { RevealDirective } from '../../core/reveal.directive';

@Component({
  selector: 'app-about-section',
  imports: [RevealDirective],
  template: `
    <section id="about" class="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-32">
      <div class="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div appReveal>
          <p class="eyebrow mb-4">ABOUT</p>
          <h2 class="section-title">{{ about().title }}</h2>
          <p class="mt-8 text-xl leading-relaxed text-white md:text-2xl">{{ about().lead }}</p>
          <div class="mt-6 space-y-4 text-lg leading-relaxed text-white/70">
            @for (p of visible(); track $index) {
              <p>{{ p }}</p>
            }
          </div>
          @if (about().paragraphs.length > preview) {
            <button
              type="button"
              class="mt-6 inline-flex items-center gap-2 font-medium text-brand hover:text-white"
              (click)="expanded.set(!expanded())"
              [attr.aria-expanded]="expanded()"
            >
              {{ expanded() ? 'הצג פחות' : 'קראו עוד' }}
              <span aria-hidden="true" class="transition-transform" [class.rotate-180]="expanded()">⌄</span>
            </button>
          }
        </div>

        <div appReveal [appRevealDelay]="150" class="relative">
          <div class="absolute -inset-4 -z-10 border border-line"></div>
          <img [src]="about().image" alt="צוות הייצור בעבודה" class="aspect-[4/3] w-full object-cover" loading="lazy" />
        </div>
      </div>
    </section>
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
