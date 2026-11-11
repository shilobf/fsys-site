import { Component, booleanAttribute, inject, input, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminApi } from './admin-api.service';

let nextId = 0;

@Component({
  selector: 'adm-text',
  host: { class: 'block' },
  imports: [FormsModule],
  template: `
    <label [for]="id" class="mb-1.5 block text-sm font-medium text-white/80">{{ label() }}</label>
    @if (multiline()) {
      <textarea
        [id]="id"
        [(ngModel)]="value"
        [rows]="rows()"
        class="adm-input resize-y leading-relaxed"
        [attr.dir]="ltr() ? 'ltr' : null"
      ></textarea>
    } @else {
      <input [id]="id" [(ngModel)]="value" class="adm-input" [attr.dir]="ltr() ? 'ltr' : null" />
    }
    @if (hint()) {
      <p class="mt-1 text-xs text-muted">{{ hint() }}</p>
    }
  `,
})
export class TextField {
  readonly label = input.required<string>();
  readonly multiline = input(false, { transform: booleanAttribute });
  readonly rows = input(3);
  readonly ltr = input(false, { transform: booleanAttribute });
  readonly hint = input('');
  readonly value = model.required<string>();
  protected readonly id = `adm-f${nextId++}`;
}

@Component({
  selector: 'adm-image',
  host: { class: 'block' },
  imports: [FormsModule],
  template: `
    <span class="mb-1.5 block text-sm font-medium text-white/80">{{ label() }}</span>
    <div class="flex gap-4">
      <div class="grid size-28 shrink-0 place-items-center overflow-hidden border border-line bg-white/5">
        @if (value()) {
          <img [src]="value()" alt="" class="size-full object-cover" />
        } @else {
          <span class="text-xs text-muted">אין תמונה</span>
        }
      </div>
      <div class="flex min-w-0 flex-1 flex-col gap-2">
        <input [(ngModel)]="value" class="adm-input" dir="ltr" [attr.aria-label]="label() + ' – כתובת'" />
        <div class="flex items-center gap-3">
          <label class="adm-btn cursor-pointer" [class.opacity-60]="busy()">
            {{ busy() ? 'מעלה…' : 'העלאת תמונה' }}
            <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" class="sr-only" (change)="pick($event)" [disabled]="busy()" />
          </label>
          @if (error()) {
            <span class="text-sm text-red-400">{{ error() }}</span>
          }
        </div>
      </div>
    </div>
  `,
})
export class ImageField {
  private readonly api = inject(AdminApi);
  readonly label = input.required<string>();
  readonly value = model.required<string>();
  protected readonly busy = signal(false);
  protected readonly error = signal('');

  protected pick(ev: Event) {
    const el = ev.target as HTMLInputElement;
    const file = el.files?.[0];
    el.value = '';
    if (!file) return;
    this.busy.set(true);
    this.error.set('');
    this.api.upload(file).subscribe({
      next: ({ url }) => {
        this.value.set(url);
        this.busy.set(false);
      },
      error: (e) => {
        this.error.set(e?.error?.message ?? 'ההעלאה נכשלה');
        this.busy.set(false);
      },
    });
  }
}

/** Editable list of plain strings (paragraphs, bullets, steps). */
@Component({
  selector: 'adm-string-list',
  host: { class: 'block' },
  imports: [FormsModule],
  template: `
    <span class="mb-1.5 block text-sm font-medium text-white/80">{{ label() }}</span>
    <div class="space-y-2">
      @for (item of items(); track $index; let i = $index, first = $first, last = $last) {
        <div class="flex items-start gap-2">
          @if (multiline()) {
            <textarea [ngModel]="item" (ngModelChange)="set(i, $event)" rows="3" class="adm-input resize-y leading-relaxed" [attr.aria-label]="label() + ' ' + (i + 1)"></textarea>
          } @else {
            <input [ngModel]="item" (ngModelChange)="set(i, $event)" class="adm-input" [attr.aria-label]="label() + ' ' + (i + 1)" />
          }
          <div class="flex shrink-0 gap-1">
            <button type="button" class="adm-icon" (click)="move(i, -1)" [disabled]="first" aria-label="הזזה למעלה">↑</button>
            <button type="button" class="adm-icon" (click)="move(i, 1)" [disabled]="last" aria-label="הזזה למטה">↓</button>
            <button type="button" class="adm-icon hover:!border-red-400 hover:!text-red-400" (click)="remove(i)" aria-label="מחיקה">✕</button>
          </div>
        </div>
      }
    </div>
    <button type="button" class="adm-link mt-2" (click)="add()">+ הוספה</button>
  `,
})
export class StringListField {
  readonly label = input.required<string>();
  readonly multiline = input(false, { transform: booleanAttribute });
  readonly items = model.required<string[]>();

  protected set(i: number, v: string) {
    this.items.update((a) => a.map((x, j) => (j === i ? v : x)));
  }
  protected add() {
    this.items.update((a) => [...a, '']);
  }
  protected remove(i: number) {
    this.items.update((a) => a.filter((_, j) => j !== i));
  }
  protected move(i: number, d: number) {
    this.items.update((a) => moveItem(a, i, d));
  }
}

export function moveItem<T>(arr: T[], i: number, d: number): T[] {
  const j = i + d;
  if (j < 0 || j >= arr.length) return arr;
  const copy = arr.slice();
  [copy[i], copy[j]] = [copy[j], copy[i]];
  return copy;
}
