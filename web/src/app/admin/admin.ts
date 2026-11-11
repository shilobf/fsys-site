import { Component, HostListener, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AdminApi } from './admin-api.service';
import { ContentEditor } from './content-editor';
import { MessagesView } from './messages-view';

@Component({
  selector: 'app-admin',
  imports: [FormsModule, ContentEditor, MessagesView],
  template: `
    @if (!api.loggedIn()) {
      <main class="grid min-h-screen place-items-center bg-ink p-4">
        <form (ngSubmit)="login()" class="w-full max-w-sm border border-line bg-panel p-8">
          <img src="/images/logo.png" alt="F-SYS" class="mb-8 h-12 brightness-0 invert" />
          <h1 class="text-2xl font-bold">כניסת מנהל</h1>
          <p class="mt-1 text-sm text-muted">עריכת תוכן האתר</p>
          <label for="pw" class="mt-8 mb-1.5 block text-sm text-white/80">סיסמה</label>
          <input id="pw" name="pw" type="password" [(ngModel)]="password" autocomplete="current-password" class="adm-input" dir="ltr" autofocus />
          @if (loginError()) {
            <p class="mt-3 text-sm text-red-400" role="alert">{{ loginError() }}</p>
          }
          <button type="submit" class="btn-primary mt-6 w-full" [disabled]="busy() || !password">
            {{ busy() ? 'מתחבר…' : 'כניסה' }}
          </button>
          <a href="/" class="adm-link mt-6 block text-center">חזרה לאתר</a>
        </form>
      </main>
    } @else {
      <div class="flex min-h-screen flex-col bg-ink">
        <header class="sticky top-0 z-40 border-b border-line bg-panel/95 backdrop-blur">
          <div class="flex h-16 items-center gap-4 px-4 md:px-6">
            <img src="/images/logo.png" alt="F-SYS" class="h-9 brightness-0 invert" />
            <span class="hidden text-sm text-muted sm:inline">ניהול תוכן</span>
            <nav class="ms-4 flex gap-1" aria-label="ניהול">
              <button type="button" class="adm-tab" [class.is-active]="view() === 'content'" (click)="view.set('content')">תוכן</button>
              <button type="button" class="adm-tab" [class.is-active]="view() === 'messages'" (click)="view.set('messages')">פניות</button>
            </nav>
            <div class="ms-auto flex items-center gap-3">
              <a href="/" target="_blank" class="adm-link hidden sm:inline">צפייה באתר ↗</a>
              <button type="button" class="adm-btn" (click)="logout()">יציאה</button>
            </div>
          </div>
        </header>

        <!-- The editor stays mounted while viewing messages so unsaved edits are kept. -->
        <app-content-editor class="flex flex-1 flex-col" [class.hidden]="view() !== 'content'" />
        @if (view() === 'messages') {
          <app-messages-view class="flex-1" />
        }
      </div>
    }
  `,
})
export class Admin {
  protected readonly api = inject(AdminApi);
  protected readonly view = signal<'content' | 'messages'>('content');
  protected readonly busy = signal(false);
  protected readonly loginError = signal('');
  protected password = '';

  protected login() {
    this.busy.set(true);
    this.loginError.set('');
    this.api.login(this.password).subscribe({
      next: () => {
        this.password = '';
        this.busy.set(false);
      },
      error: (e: HttpErrorResponse) => {
        this.busy.set(false);
        this.loginError.set(e.status === 401 ? 'סיסמה שגויה' : 'השרת אינו זמין כרגע');
      },
    });
  }

  private readonly editor = viewChild(ContentEditor);

  protected logout() {
    if (this.editor()?.isDirty() && !confirm('יש שינויים שלא נשמרו. לצאת בכל זאת?')) return;
    this.api.logout();
  }

  @HostListener('window:beforeunload', ['$event'])
  protected warnUnsaved(e: BeforeUnloadEvent) {
    if (this.editor()?.isDirty()) e.preventDefault();
  }
}
