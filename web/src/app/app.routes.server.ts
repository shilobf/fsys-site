import { RenderMode, ServerRoute } from '@angular/ssr';

// Rendered per request (not prerendered) so content edited by the admin shows up immediately.
export const serverRoutes: ServerRoute[] = [
  // Admin is browser-only (session token lives in sessionStorage).
  { path: 'admin', renderMode: RenderMode.Client },
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
