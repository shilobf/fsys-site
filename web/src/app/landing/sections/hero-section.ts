import { Component, ElementRef, afterNextRender, computed, input, signal, viewChildren } from '@angular/core';
import { SiteContent } from '../../core/content.model';

/**
 * Full-screen hero. Background videos play one after another in a loop, cross-fading between
 * two stacked <video> elements (the idle one preloads the next clip). The image is the poster and
 * the fallback for reduced-motion users or when there are no videos.
 */
@Component({
  selector: 'app-hero-section',
  template: `
    <section id="top" class="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      <img [src]="hero().image" alt="" class="absolute inset-0 -z-30 size-full object-cover" fetchpriority="high" />

      @if (videos().length) {
        @for (slot of slots(); track slot) {
          <video
            #vid
            class="absolute inset-0 -z-20 size-full object-cover transition-opacity duration-1000"
            [class.opacity-0]="activeSlot() !== slot || !playing()"
            [attr.src]="slotSrc()[slot]"
            [poster]="hero().image"
            muted
            playsinline
            preload="auto"
            aria-hidden="true"
            (ended)="next(slot)"
            (playing)="playing.set(true)"
          ></video>
        }
      }

      <div class="absolute inset-0 -z-10 bg-fs-deep/50"></div>

      <div class="mx-auto flex w-full max-w-7xl flex-1 items-center justify-center px-4 pt-32 pb-24 text-white md:px-8">
        <div class="max-w-4xl text-center">
          @if (hero().eyebrow) {
            <p class="font-latin mb-5 text-xs font-bold tracking-[0.35em] text-brand md:text-sm">{{ hero().eyebrow }}</p>
          }
          <h1 dir="auto" class="text-5xl leading-[1.1] font-extrabold [text-wrap:balance] drop-shadow-[0_2px_12px_rgba(0,0,0,.45)] md:text-7xl">
            {{ hero().title }}
          </h1>
          <p class="font-latin mt-6 text-sm font-bold tracking-[0.25em] text-brand drop-shadow-[0_1px_6px_rgba(0,0,0,.9)] md:text-base" dir="ltr">
            {{ hero().tagline }}
          </p>
          <div class="mx-auto mt-6 max-w-2xl space-y-1 text-lg text-white/90 md:text-xl">
            @for (line of hero().lines; track $index) {
              <p>{{ line }}</p>
            }
          </div>
          <div class="mt-10 flex flex-wrap justify-center gap-4">
            <a href="#capabilities" class="btn-primary">{{ hero().ctaPrimary }}</a>
            <a href="#contact" class="btn-ghost">{{ hero().ctaSecondary }}</a>
          </div>
        </div>
      </div>

      <a href="#about" class="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 hover:text-white" aria-label="גלילה לתוכן">
        <span class="block animate-bounce text-3xl leading-none" aria-hidden="true">⌄</span>
      </a>
    </section>
  `,
})
export class HeroSection {
  readonly hero = input.required<SiteContent['hero']>();

  protected readonly videos = computed(() => (this.hero().videos ?? []).filter(Boolean));
  protected readonly slots = computed(() => (this.videos().length > 1 ? [0, 1] : [0]));
  /** Which clip index each of the two <video> slots holds. */
  private readonly slotClip = signal<[number, number]>([0, 1]);
  protected readonly activeSlot = signal(0);
  protected readonly playing = signal(false);
  protected readonly slotSrc = computed(() => {
    const v = this.videos();
    const [a, b] = this.slotClip();
    return [v[a % v.length], v[b % v.length]];
  });

  private readonly els = viewChildren<ElementRef<HTMLVideoElement>>('vid');
  private reducedMotion = true;

  constructor() {
    afterNextRender(() => {
      this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!this.reducedMotion) this.play(0);
    });
  }

  /** Called when the clip in `slot` ends: show the other slot, then load the following clip into this one. */
  protected next(slot: number) {
    const v = this.videos();
    if (v.length < 2) {
      this.play(slot);
      return;
    }
    const other = 1 - slot;
    this.activeSlot.set(other);
    this.play(other);
    this.slotClip.update((clips) => {
      const copy: [number, number] = [...clips];
      copy[slot] = (clips[other] + 1) % v.length;
      return copy;
    });
  }

  private play(slot: number) {
    const el = this.els()[slot]?.nativeElement;
    if (!el) return;
    el.muted = true; // required for autoplay
    el.currentTime = 0;
    el.play().catch(() => this.playing.set(false));
  }
}
