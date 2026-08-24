/// <reference lib="webworker" />
import { defaultCache } from '@serwist/next/worker';
import { NetworkFirst, NetworkOnly, Serwist } from 'serwist';
import type { PrecacheEntry, RuntimeCaching, SerwistGlobalConfig } from 'serwist';

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}
declare const self: ServiceWorkerGlobalScope;

const networkOnlyExternalApis: RuntimeCaching[] = [
  {
    // Question pool JSON — deliberately NOT cached by the service worker.
    // examData.ts already versions and caches this in localStorage
    // (ham-questions-${examType}-v2); a second cache layer here would
    // reintroduce the stale-pool bug that versioning was added to fix.
    matcher: ({ url }) => url.hostname === 'raw.githubusercontent.com',
    handler: new NetworkOnly()
  },
  {
    // Supabase analytics RPCs (session start/end, attempt logging) —
    // dynamic writes, never cacheable. Fail silently offline by design.
    matcher: ({ url }) => url.hostname.endsWith('.supabase.co'),
    handler: new NetworkOnly()
  }
];

const navigationCache: RuntimeCaching[] = [
  {
    // @serwist/next's defaultCache matches HTML navigations by checking
    // request.headers.get('Content-Type'), which browsers don't set on
    // navigation *requests* (it's a response header) — so that rule never
    // actually matches a real reload, and offline reloads of visited pages
    // fall through to the /offline fallback instead of their own cache.
    // request.mode === 'navigate' is the correct, standard way to detect
    // a document navigation; placed before defaultCache so it wins.
    matcher: ({ request }) => request.mode === 'navigate',
    handler: new NetworkFirst({ cacheName: 'pages', networkTimeoutSeconds: 5 })
  }
];

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [...networkOnlyExternalApis, ...navigationCache, ...defaultCache],
  fallbacks: {
    entries: [
      {
        url: '/offline',
        matcher({ request }) {
          return request.destination === 'document';
        }
      }
    ]
  }
});

serwist.addEventListeners();
