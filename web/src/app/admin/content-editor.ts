import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NgTemplateOutlet } from '@angular/common';
import { SiteContent } from '../core/content.model';
import { AdminApi } from './admin-api.service';
import { ImageField, StringListField, TextField, moveItem } from './fields';

type SectionKey = 'company' | 'hero' | 'stats' | 'about' | 'capabilities' | 'process' | 'products' | 'contact';

@Component({
  selector: 'app-content-editor',
  imports: [TextField, ImageField, StringListField, NgTemplateOutlet],
  template: `
    @if (loadError()) {
      <p class="p-8 text-red-400" role="alert">{{ loadError() }}</p>
    } @else if (draft(); as d) {
      <div class="flex flex-1 flex-col md:flex-row">
        <aside class="border-line md:w-56 md:shrink-0 md:border-e">
          <nav class="flex gap-1 overflow-x-auto p-3 md:sticky md:top-16 md:flex-col md:p-4" aria-label="סקשנים">
            @for (s of sections; track s.key) {
              <button type="button" class="adm-side" [class.is-active]="active() === s.key" (click)="active.set(s.key)">
                {{ s.label }}
              </button>
            }
          </nav>
        </aside>

        <div class="min-w-0 flex-1 pb-28">
          <div class="mx-auto max-w-3xl space-y-6 px-4 py-8 md:px-8">
            @switch (active()) {
              @case ('company') {
                <h2 class="adm-h2">פרטי חברה</h2>
                <adm-text label="שם החברה" [(value)]="d.company.name" />
                <adm-text label="שם מקוצר" [(value)]="d.company.shortName" ltr />
                <adm-image label="לוגו" [(value)]="d.company.logo" />
              }
              @case ('hero') {
                <h2 class="adm-h2">פתיח (Hero)</h2>
                <adm-text label="כותרת עליונה" [(value)]="d.hero.eyebrow" ltr />
                <adm-text label="כותרת ראשית" [(value)]="d.hero.title" />
                <adm-text label="שורת תחומים" [(value)]="d.hero.tagline" ltr />
                <adm-string-list label="שורות תיאור" [(items)]="d.hero.lines" />
                <div class="grid gap-6 sm:grid-cols-2">
                  <adm-text label="כפתור ראשי" [(value)]="d.hero.ctaPrimary" />
                  <adm-text label="כפתור משני" [(value)]="d.hero.ctaSecondary" />
                </div>
                <adm-image label="תמונת רקע (מוצגת עד שהסרטון נטען)" [(value)]="d.hero.image" />
                <adm-string-list label="סרטוני רקע (מתנגנים ברצף)" [(items)]="d.hero.videos" />
                <p class="-mt-4 text-xs text-muted">נתיב לקובץ MP4, לדוגמה /videos/hero-1.mp4</p>
              }
              @case ('stats') {
                <h2 class="adm-h2">נתונים בולטים</h2>
                <p class="text-sm text-muted">מוצגים בפס שבתחתית הפתיח.</p>
                @for (s of d.stats; track $index; let i = $index) {
                  <div class="adm-card">
                    <ng-container *ngTemplateOutlet="itemTools; context: { list: 'stats', i, n: d.stats.length }" />
                    <div class="grid gap-4 sm:grid-cols-2">
                      <adm-text label="ערך" [(value)]="s.value" />
                      <adm-text label="תווית" [(value)]="s.label" />
                    </div>
                  </div>
                }
                <button type="button" class="adm-btn" (click)="add('stats')">+ הוספת נתון</button>
              }
              @case ('about') {
                <h2 class="adm-h2">אודות</h2>
                <adm-text label="כותרת" [(value)]="d.about.title" />
                <adm-text label="פסקת פתיחה" [(value)]="d.about.lead" multiline [rows]="4" />
                <adm-string-list label="פסקאות" [(items)]="d.about.paragraphs" multiline />
                <adm-image label="תמונה" [(value)]="d.about.image" />
              }
              @case ('capabilities') {
                <h2 class="adm-h2">תחומי ליבה</h2>
                <adm-text label="כותרת" [(value)]="d.capabilities.title" />
                <adm-text label="תיאור" [(value)]="d.capabilities.intro" multiline [rows]="2" />
                @for (c of d.capabilities.items; track $index; let i = $index) {
                  <div class="adm-card">
                    <ng-container *ngTemplateOutlet="itemTools; context: { list: 'capabilities', i, n: d.capabilities.items.length }" />
                    <adm-text label="כותרת" [(value)]="c.title" />
                    <adm-text label="תת-כותרת" [(value)]="c.subtitle" />
                    <adm-text label="שלבים" [(value)]="c.steps" hint="לדוגמה: תכן • רכש • ייצור • בדיקות" />
                    <adm-image label="תמונה" [(value)]="c.image" />
                    <adm-text label="הדמיה תלת-ממדית (לא חובה)" [value]="c.simulation ?? ''" (valueChange)="c.simulation = $event || undefined" ltr hint="נתיב לדף HTML באתר, לדוגמה /sims/generator-3d.html" />
                  </div>
                }
                <button type="button" class="adm-btn" (click)="add('capabilities')">+ הוספת תחום</button>
              }
              @case ('process') {
                <h2 class="adm-h2">מקצה לקצה</h2>
                <adm-text label="כותרת" [(value)]="d.process.title" />
                <adm-string-list label="שלבים" [(items)]="d.process.steps" />
              }
              @case ('products') {
                <h2 class="adm-h2">קווי מוצרים</h2>
                <adm-text label="כותרת" [(value)]="d.products.title" />
                <adm-text label="תיאור" [(value)]="d.products.intro" multiline [rows]="2" />
                <adm-image label="תמונת רקע" [(value)]="d.products.background" />
                @for (p of d.products.items; track $index; let i = $index) {
                  <div class="adm-card">
                    <ng-container *ngTemplateOutlet="itemTools; context: { list: 'products', i, n: d.products.items.length }" />
                    <adm-text label="שם המוצר" [(value)]="p.title" />
                    <adm-text label="תיאור" [(value)]="p.description" multiline [rows]="2" />
                    <adm-string-list label="נקודות" [(items)]="p.bullets" />
                    <adm-image label="תמונה" [(value)]="p.image" />
                  </div>
                }
                <button type="button" class="adm-btn" (click)="add('products')">+ הוספת מוצר</button>
              }
              @case ('contact') {
                <h2 class="adm-h2">צור קשר</h2>
                <adm-text label="כותרת" [(value)]="d.contact.title" />
                <adm-text label="תיאור" [(value)]="d.contact.intro" multiline [rows]="2" />
                <div class="grid gap-6 sm:grid-cols-2">
                  <adm-text label="אימייל" [(value)]="d.contact.email" ltr />
                  <adm-text label="טלפון" [(value)]="d.contact.phone" ltr />
                  <adm-text label="כתובת" [(value)]="d.contact.address" />
                  <adm-text label="אתר" [(value)]="d.contact.website" ltr />
                </div>
              }
            }
          </div>
        </div>
      </div>

      <div class="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-panel/95 backdrop-blur">
        <div class="flex items-center gap-4 px-4 py-3 md:px-6">
          <p class="text-sm" aria-live="polite">
            @switch (status()) {
              @case ('saving') { <span class="text-muted">שומר…</span> }
              @case ('saved') { <span class="text-brand">נשמר ✓ השינויים כבר באתר</span> }
              @case ('error') { <span class="text-red-400">{{ saveError() }}</span> }
              @default {
                @if (isDirty()) { <span class="text-amber-300">יש שינויים שלא נשמרו</span> }
                @else { <span class="text-muted">אין שינויים</span> }
              }
            }
          </p>
          <div class="ms-auto flex gap-3">
            <button type="button" class="adm-btn" (click)="revert()" [disabled]="!isDirty() || status() === 'saving'">ביטול שינויים</button>
            <button type="button" class="btn-primary !py-2" (click)="save()" [disabled]="!isDirty() || status() === 'saving'">שמירה</button>
          </div>
        </div>
      </div>
    } @else {
      <p class="p-8 text-muted">טוען…</p>
    }

    <ng-template #itemTools let-list="list" let-i="i" let-n="n">
      <div class="-mt-1 mb-1 flex items-center gap-1">
        <span class="font-latin me-auto text-sm text-brand">#{{ i + 1 }}</span>
        <button type="button" class="adm-icon" (click)="move(list, i, -1)" [disabled]="i === 0" aria-label="הזזה למעלה">↑</button>
        <button type="button" class="adm-icon" (click)="move(list, i, 1)" [disabled]="i === n - 1" aria-label="הזזה למטה">↓</button>
        <button type="button" class="adm-icon hover:!border-red-400 hover:!text-red-400" (click)="remove(list, i)" aria-label="מחיקה">✕</button>
      </div>
    </ng-template>
  `,
})
export class ContentEditor {
  private readonly api = inject(AdminApi);

  protected readonly sections: { key: SectionKey; label: string }[] = [
    { key: 'hero', label: 'פתיח' },
    { key: 'stats', label: 'נתונים בולטים' },
    { key: 'about', label: 'אודות' },
    { key: 'capabilities', label: 'תחומי ליבה' },
    { key: 'process', label: 'מקצה לקצה' },
    { key: 'products', label: 'קווי מוצרים' },
    { key: 'contact', label: 'צור קשר' },
    { key: 'company', label: 'פרטי חברה' },
  ];

  protected readonly active = signal<SectionKey>('hero');
  /** Mutable working copy; edits are written straight into it by the field components. */
  protected readonly draft = signal<SiteContent | null>(null);
  protected readonly status = signal<'idle' | 'saving' | 'saved' | 'error'>('idle');
  protected readonly saveError = signal('');
  protected readonly loadError = signal('');
  private saved = '';

  constructor() {
    this.api.getContent().subscribe({
      next: (c) => this.reset(c),
      error: () => this.loadError.set('טעינת התוכן נכשלה. ודאו שה-API רץ.'),
    });
  }

  isDirty(): boolean {
    const d = this.draft();
    return !!d && JSON.stringify(d) !== this.saved;
  }

  protected save() {
    const d = this.draft();
    if (!d) return;
    this.status.set('saving');
    this.api.saveContent(d).subscribe({
      next: (c) => {
        this.reset(c);
        this.status.set('saved');
        setTimeout(() => this.status() === 'saved' && this.status.set('idle'), 4000);
      },
      error: (e: HttpErrorResponse) => {
        this.status.set('error');
        this.saveError.set(e.status === 401 ? 'פג תוקף ההתחברות – התחברו מחדש' : 'השמירה נכשלה');
      },
    });
  }

  protected revert() {
    if (confirm('לבטל את כל השינויים שלא נשמרו?')) this.reset(JSON.parse(this.saved));
  }

  protected add(list: 'stats' | 'capabilities' | 'products') {
    const d = this.draft()!;
    if (list === 'stats') d.stats.push({ value: '', label: '' });
    if (list === 'capabilities') d.capabilities.items.push({ title: '', subtitle: '', steps: '', image: '' });
    if (list === 'products') d.products.items.push({ title: '', description: '', bullets: [], image: '' });
  }

  protected remove(list: 'stats' | 'capabilities' | 'products', i: number) {
    if (!confirm('למחוק את הפריט?')) return;
    const d = this.draft()!;
    if (list === 'stats') d.stats.splice(i, 1);
    if (list === 'capabilities') d.capabilities.items.splice(i, 1);
    if (list === 'products') d.products.items.splice(i, 1);
  }

  protected move(list: 'stats' | 'capabilities' | 'products', i: number, dir: number) {
    const d = this.draft()!;
    if (list === 'stats') d.stats = moveItem(d.stats, i, dir);
    if (list === 'capabilities') d.capabilities.items = moveItem(d.capabilities.items, i, dir);
    if (list === 'products') d.products.items = moveItem(d.products.items, i, dir);
  }

  private reset(c: SiteContent) {
    c.hero.videos ??= []; // documents saved before videos existed
    this.saved = JSON.stringify(c);
    this.draft.set(JSON.parse(this.saved));
    this.status.set('idle');
  }
}
