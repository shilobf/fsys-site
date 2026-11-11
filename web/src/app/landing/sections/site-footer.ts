import { Component, input } from '@angular/core';
import { SiteContent } from '../../core/content.model';

@Component({
  selector: 'app-site-footer',
  template: `
    <footer class="border-t border-line">
      <div class="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-8">
        <img [src]="company().logo" [alt]="company().shortName" class="h-12 w-auto self-start brightness-0 invert" />
        <p class="text-sm text-muted">
          © {{ year }} {{ company().name }} · {{ contact().address }}
        </p>
        <a [href]="'https://' + contact().website" class="font-latin text-sm text-white/70 hover:text-brand" dir="ltr">{{
          contact().website
        }}</a>
      </div>
    </footer>
  `,
})
export class SiteFooter {
  readonly company = input.required<SiteContent['company']>();
  readonly contact = input.required<SiteContent['contact']>();
  protected readonly year = new Date().getFullYear();
}
