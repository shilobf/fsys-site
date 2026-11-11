import { Directive, ElementRef, afterNextRender, inject, input, DestroyRef } from '@angular/core';

/**
 * Fades an element in when it scrolls into view.
 * Runs only in the browser and skips elements already on screen, so SSR output never flashes.
 */
@Directive({ selector: '[appReveal]' })
export class RevealDirective {
  readonly appRevealDelay = input(0);

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9) return;

      el.style.setProperty('--reveal-delay', `${this.appRevealDelay()}ms`);
      el.classList.add('reveal');
      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            el.classList.add('is-visible');
            io.disconnect();
          }
        },
        { threshold: 0.15 },
      );
      io.observe(el);
      destroyRef.onDestroy(() => io.disconnect());
    });
  }
}
