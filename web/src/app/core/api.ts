import { InjectionToken } from '@angular/core';

/** Origin of the NestJS API. Empty in the browser (same-origin /api, proxied by server.ts). */
export const API_BASE = new InjectionToken<string>('API_BASE', { factory: () => '' });
