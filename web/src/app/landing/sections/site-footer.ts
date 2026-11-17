import { Component, input } from '@angular/core';
import { SiteContent } from '../../core/content.model';

@Component({
  selector: 'app-site-footer',
  template: `
    <footer class="bg-fs-deep text-white">
      <div class="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 md:px-8 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <a href="#top" class="inline-block bg-white p-3" [attr.aria-label]="company().name">
            <img [src]="company().logo" alt="" class="h-14 w-auto" />
          </a>
          <p class="mt-5 text-sm text-white/70">{{ company().name }}</p>
          <dl class="mt-5 space-y-1 text-sm">
            <dt class="font-bold text-brand">צרו קשר</dt>
            <dd><a [href]="'mailto:' + contact().email" class="hover:text-brand" dir="ltr">{{ contact().email }}</a></dd>
            <dd><a [href]="'tel:' + contact().phone" class="hover:text-brand" dir="ltr">{{ contact().phone }}</a></dd>
            <dd class="text-white/70">{{ contact().address }}</dd>
          </dl>
        </div>

        <nav class="lg:border-s lg:border-white/15 lg:ps-8" aria-label="תחומי ליבה">
          <h2 class="mb-4 font-bold text-white">{{ capabilities().title }}</h2>
          <ul class="space-y-2.5 text-sm text-white/75">
            @for (c of capabilities().items; track $index) {
              <li><a href="#capabilities" class="hover:text-brand">{{ c.title }}</a></li>
            }
          </ul>
        </nav>

        <nav class="lg:border-s lg:border-white/15 lg:ps-8" aria-label="קווי מוצרים">
          <h2 class="mb-4 font-bold text-white">{{ products().title }}</h2>
          <ul class="space-y-2.5 text-sm text-white/75">
            @for (p of products().items; track $index) {
              <li><a href="#products" class="hover:text-brand">{{ p.title }}</a></li>
            }
          </ul>
        </nav>

        <nav class="lg:border-s lg:border-white/15 lg:ps-8" aria-label="החברה">
          <h2 class="mb-4 font-bold text-white">החברה</h2>
          <ul class="space-y-2.5 text-sm text-white/75">
            <li><a href="#about" class="hover:text-brand">אודות</a></li>
            <li><a href="#process" class="hover:text-brand">מקצה לקצה</a></li>
            <li><a href="#contact" class="hover:text-brand">צרו קשר</a></li>
            <li>
              <a [href]="'https://' + contact().website" class="font-latin hover:text-brand" dir="ltr">{{ contact().website }}</a>
            </li>
          </ul>
        </nav>
      </div>

      <div class="border-t border-white/10 bg-black/20">
        <p class="mx-auto max-w-7xl px-4 py-5 pb-24 text-center text-xs text-white/55 md:px-8 md:pb-24">
          © {{ year }} {{ company().name }} · כל הזכויות שמורות
        </p>
      </div>
    </footer>
  `,
})
export class SiteFooter {
  readonly company = input.required<SiteContent['company']>();
  readonly contact = input.required<SiteContent['contact']>();
  readonly capabilities = input.required<SiteContent['capabilities']>();
  readonly products = input.required<SiteContent['products']>();
  protected readonly year = new Date().getFullYear();
}
