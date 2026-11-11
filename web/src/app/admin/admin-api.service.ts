import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { SiteContent } from '../core/content.model';

export interface ContactMessage {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string;
}

const TOKEN_KEY = 'fsys-admin-token';

/** Admin session + authenticated calls. The token lives in sessionStorage (cleared when the tab closes). */
@Injectable({ providedIn: 'root' })
export class AdminApi {
  private readonly http = inject(HttpClient);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly token = signal<string | null>(this.browser ? sessionStorage.getItem(TOKEN_KEY) : null);

  readonly loggedIn = computed(() => !!this.token());

  login(password: string): Observable<void> {
    return this.http.post<{ token: string }>('/api/auth/login', { password }).pipe(
      tap(({ token }) => {
        this.token.set(token);
        sessionStorage.setItem(TOKEN_KEY, token);
      }),
      map(() => undefined),
    );
  }

  logout() {
    this.token.set(null);
    if (this.browser) sessionStorage.removeItem(TOKEN_KEY);
  }

  getContent() {
    return this.http.get<SiteContent>('/api/content', { headers: { 'cache-control': 'no-cache' } });
  }

  saveContent(content: SiteContent) {
    return this.authed(this.http.put<SiteContent>('/api/content', content, { headers: this.headers() }));
  }

  messages() {
    return this.authed(this.http.get<ContactMessage[]>('/api/contact', { headers: this.headers() }));
  }

  upload(file: File) {
    const body = new FormData();
    body.append('file', file);
    return this.authed(this.http.post<{ url: string }>('/api/uploads', body, { headers: this.headers() }));
  }

  private headers() {
    return new HttpHeaders({ authorization: `Bearer ${this.token() ?? ''}` });
  }

  /** An expired/invalid token sends the user back to the login screen. */
  private authed<T>(req: Observable<T>): Observable<T> {
    return req.pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) this.logout();
        return throwError(() => err);
      }),
    );
  }
}
