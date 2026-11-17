import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SiteContent } from '../../core/content.model';
import { ContentService } from '../../core/content.service';
import { RevealDirective } from '../../core/reveal.directive';

interface ContactField {
  name: 'name' | 'company' | 'email' | 'phone' | 'message';
  label: string;
  type: string;
  required?: boolean;
  autocomplete?: string;
  ltr?: boolean;
  wide?: boolean;
}

@Component({
  selector: 'app-contact-section',
  imports: [ReactiveFormsModule, RevealDirective],
  template: `
    <section id="contact" class="bg-surface py-20 md:py-28">
      <div class="mx-auto grid max-w-7xl gap-14 px-4 md:px-8 lg:grid-cols-[2fr_3fr]">
        <div appReveal>
          <h2 class="chip">{{ contact().title }}</h2>
          <p class="mt-6 text-lg text-fs-gray">{{ contact().intro }}</p>

          <dl class="mt-10 space-y-6 border-s-[3px] border-fs-green ps-6">
            <div>
              <dt class="text-sm font-bold text-fs-blue">אימייל</dt>
              <dd><a [href]="'mailto:' + contact().email" class="text-xl text-fs-gray hover:text-brand" dir="ltr">{{ contact().email }}</a></dd>
            </div>
            <div>
              <dt class="text-sm font-bold text-fs-blue">טלפון</dt>
              <dd><a [href]="'tel:' + contact().phone" class="text-xl text-fs-gray hover:text-brand" dir="ltr">{{ contact().phone }}</a></dd>
            </div>
            <div>
              <dt class="text-sm font-bold text-fs-blue">כתובת</dt>
              <dd class="text-xl text-fs-gray">{{ contact().address }}</dd>
            </div>
          </dl>
        </div>

        <form appReveal [appRevealDelay]="120" [formGroup]="form" (ngSubmit)="submit()" class="grid gap-5 bg-white p-6 shadow-sm sm:grid-cols-2 md:p-8" novalidate>
          @for (f of fields; track f.name) {
            <label class="flex flex-col gap-2" [class.sm:col-span-2]="f.wide">
              <span class="text-sm font-bold text-fs-gray">{{ f.label }}@if (f.required) {<span class="text-brand"> *</span>}</span>
              @if (f.name === 'message') {
                <textarea [formControlName]="f.name" rows="5" class="field resize-y"></textarea>
              } @else {
                <input [formControlName]="f.name" [type]="f.type" [attr.autocomplete]="f.autocomplete" class="field" [attr.dir]="f.ltr ? 'ltr' : null" />
              }
            </label>
          }

          <div class="flex flex-wrap items-center gap-5 sm:col-span-2">
            <button type="submit" class="btn-primary" [disabled]="status() === 'sending'">
              {{ status() === 'sending' ? 'שולח…' : 'שליחה' }}
            </button>
            <p aria-live="polite" class="text-sm">
              @switch (status()) {
                @case ('sent') { <span class="text-brand">תודה! ההודעה התקבלה ונחזור אליכם בהקדם.</span> }
                @case ('invalid') { <span class="text-amber-600">נא למלא שם, אימייל תקין והודעה.</span> }
                @case ('error') { <span class="text-red-600">השליחה נכשלה. נסו שוב או פנו אלינו במייל.</span> }
              }
            </p>
          </div>
        </form>
      </div>
    </section>
  `,
  styles: `
    .field {
      background: white;
      border: 0;
      border-bottom: 2px solid var(--color-rule);
      padding: 0.6rem 0.25rem;
      font-size: 1rem;
      color: var(--color-fs-gray);
      transition: border-color 0.2s;
    }
    .field:focus {
      outline: none;
      border-bottom-color: var(--color-brand);
    }
    .field.ng-invalid.ng-touched {
      border-bottom-color: #dc2626;
    }
  `,
})
export class ContactSection {
  readonly contact = input.required<SiteContent['contact']>();
  private readonly api = inject(ContentService);
  protected readonly status = signal<'idle' | 'sending' | 'sent' | 'invalid' | 'error'>('idle');

  protected readonly form = inject(FormBuilder).nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    company: [''],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    message: ['', [Validators.required, Validators.maxLength(5000)]],
  });

  protected readonly fields: readonly ContactField[] = [
    { name: 'name', label: 'שם מלא', type: 'text', required: true, autocomplete: 'name' },
    { name: 'company', label: 'חברה', type: 'text', autocomplete: 'organization' },
    { name: 'email', label: 'אימייל', type: 'email', required: true, autocomplete: 'email', ltr: true },
    { name: 'phone', label: 'טלפון', type: 'tel', autocomplete: 'tel', ltr: true },
    { name: 'message', label: 'הודעה', type: 'text', required: true, wide: true },
  ];

  protected submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.status.set('invalid');
      return;
    }
    this.status.set('sending');
    this.api.sendContact(this.form.getRawValue()).subscribe({
      next: () => {
        this.status.set('sent');
        this.form.reset();
      },
      error: () => this.status.set('error'),
    });
  }
}
