import { Component, afterNextRender, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContentService } from '../../core/content.service';

const DISMISS_KEY = 'fsys-consult-dismissed';

/** Sticky bottom bar with a short "talk to an expert" form (desktop only; mobile uses the contact section). */
@Component({
  selector: 'app-consult-bar',
  imports: [ReactiveFormsModule],
  template: `
    @if (visible()) {
      <aside class="fixed inset-x-0 bottom-0 z-40 hidden bg-fs-deep/95 text-white shadow-[0_-6px_24px_rgba(0,0,0,.25)] backdrop-blur md:block" aria-label="שיחה עם מומחה">
        <form [formGroup]="form" (ngSubmit)="submit()" class="mx-auto flex max-w-7xl items-stretch gap-6 pe-12 ps-4 md:ps-8" novalidate>
          <p class="flex shrink-0 items-center bg-brand px-5 text-base leading-tight font-bold">דברו עם<br />מומחה</p>

          @if (status() === 'sent') {
            <p class="flex flex-1 items-center py-5 text-brand" role="status">תודה! נציג יחזור אליכם בהקדם.</p>
          } @else {
            <div class="grid flex-1 grid-cols-3 gap-6 py-4">
              <input formControlName="name" class="bar-field" placeholder="שם" autocomplete="name" aria-label="שם" />
              <input formControlName="company" class="bar-field" placeholder="חברה" autocomplete="organization" aria-label="חברה" />
              <input formControlName="email" type="email" class="bar-field" placeholder="אימייל" autocomplete="email" aria-label="אימייל" dir="ltr" />
            </div>
            <div class="flex items-center">
              <button type="submit" class="bg-brand px-5 py-2 font-bold transition-colors hover:bg-white hover:text-fs-blue disabled:opacity-60" [disabled]="status() === 'sending'">
                {{ status() === 'sending' ? 'שולח…' : status() === 'error' ? 'נסו שוב' : 'שליחה' }}
              </button>
            </div>
            @if (status() === 'error') {
              <p class="sr-only" role="alert">השליחה נכשלה, נסו שוב</p>
            }
          }
        </form>
        <button type="button" class="absolute top-1/2 end-3 grid size-8 -translate-y-1/2 place-items-center text-white/70 hover:text-white" (click)="dismiss()" aria-label="סגירה">✕</button>
      </aside>
    }
  `,
  styles: `
    .bar-field {
      background: transparent;
      border: 0;
      border-bottom: 2px solid rgb(255 255 255 / 0.35);
      padding: 0.4rem 0.1rem;
      color: white;
      min-width: 0;
    }
    .bar-field::placeholder { color: rgb(255 255 255 / 0.7); font-weight: 700; }
    .bar-field:focus { outline: none; border-bottom-color: var(--color-brand); }
    .bar-field.ng-invalid.ng-touched { border-bottom-color: #f87171; }
  `,
})
export class ConsultBar {
  private readonly api = inject(ContentService);
  /** Rendered only in the browser, after checking whether the visitor closed it this session. */
  protected readonly visible = signal(false);
  protected readonly status = signal<'idle' | 'sending' | 'sent' | 'error'>('idle');

  protected readonly form = inject(FormBuilder).nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    company: [''],
    email: ['', [Validators.required, Validators.email]],
  });

  constructor() {
    afterNextRender(() => {
      let dismissed = false;
      try {
        dismissed = sessionStorage.getItem(DISMISS_KEY) === '1';
      } catch {}
      this.visible.set(!dismissed);
    });
  }

  protected dismiss() {
    this.visible.set(false);
    try {
      sessionStorage.setItem(DISMISS_KEY, '1');
    } catch {}
  }

  protected submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.status.set('sending');
    const v = this.form.getRawValue();
    this.api.sendContact({ ...v, message: 'בקשה לשיחה עם מומחה (מהפס התחתון באתר)' }).subscribe({
      next: () => this.status.set('sent'),
      error: () => this.status.set('error'),
    });
  }
}
