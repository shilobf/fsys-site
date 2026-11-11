import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, TransferState, inject, makeStateKey } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { Observable, of, tap } from 'rxjs';
import { API_BASE } from './api';
import { SiteContent } from './content.model';

const CONTENT_KEY = makeStateKey<SiteContent>('site-content');

@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly http = inject(HttpClient);
  private readonly base = inject(API_BASE);
  private readonly state = inject(TransferState);
  private readonly isServer = isPlatformServer(inject(PLATFORM_ID));

  /** Loads site content. SSR fetches it and hands it to the browser via TransferState. */
  load(): Observable<SiteContent> {
    const cached = this.state.get(CONTENT_KEY, null);
    if (cached && !this.isServer) {
      this.state.remove(CONTENT_KEY);
      return of(cached);
    }
    return this.http
      .get<SiteContent>(`${this.base}/api/content`)
      .pipe(tap((c) => this.isServer && this.state.set(CONTENT_KEY, c)));
  }

  sendContact(msg: { name: string; company?: string; email: string; phone?: string; message: string }) {
    return this.http.post<{ ok: boolean }>(`${this.base}/api/contact`, msg);
  }
}
