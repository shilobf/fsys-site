import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AdminApi, ContactMessage } from './admin-api.service';

@Component({
  selector: 'app-messages-view',
  imports: [DatePipe],
  template: `
    <div class="mx-auto max-w-4xl px-4 py-8 md:px-6">
      <div class="mb-6 flex items-center justify-between">
        <h1 class="text-2xl font-bold">פניות מטופס צור קשר</h1>
        <button type="button" class="adm-btn" (click)="load()">רענון</button>
      </div>

      @if (error()) {
        <p class="text-red-400" role="alert">{{ error() }}</p>
      } @else if (messages() === null) {
        <p class="text-muted">טוען…</p>
      } @else if (!messages()!.length) {
        <p class="border border-line bg-panel p-8 text-center text-muted">עדיין אין פניות.</p>
      } @else {
        <ul class="space-y-4">
          @for (m of messages(); track m.id) {
            <li class="border border-line bg-panel p-5">
              <div class="flex flex-wrap items-baseline justify-between gap-2">
                <p class="text-lg font-bold">
                  {{ m.name }}
                  @if (m.company) {
                    <span class="font-normal text-muted">· {{ m.company }}</span>
                  }
                </p>
                <time class="text-sm text-muted" dir="ltr">{{ m.createdAt | date: 'dd/MM/yyyy HH:mm' }}</time>
              </div>
              <p class="mt-1 flex flex-wrap gap-x-4 text-sm" dir="ltr">
                <a [href]="'mailto:' + m.email" class="text-brand hover:underline">{{ m.email }}</a>
                @if (m.phone) {
                  <a [href]="'tel:' + m.phone" class="text-white/70 hover:underline">{{ m.phone }}</a>
                }
              </p>
              <p class="mt-3 whitespace-pre-line text-white/85">{{ m.message }}</p>
            </li>
          }
        </ul>
      }
    </div>
  `,
})
export class MessagesView {
  private readonly api = inject(AdminApi);
  protected readonly messages = signal<ContactMessage[] | null>(null);
  protected readonly error = signal('');

  constructor() {
    this.load();
  }

  protected load() {
    this.error.set('');
    this.api.messages().subscribe({
      next: (m) => this.messages.set(m),
      error: () => this.error.set('טעינת הפניות נכשלה'),
    });
  }
}
