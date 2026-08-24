const withSerwistInit = require('@serwist/next').default

const withSerwist = withSerwistInit({
  swSrc: 'src/app/sw.ts',
  swDest: 'public/sw.js',
  cacheOnNavigation: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === 'development',
  exclude: [
    /\.map$/,
    /^build-manifest\.json$/,
    /^react-loadable-manifest\.json$/,
    /dynamic-css-manifest\.json$/
  ],
  // Serwist only auto-precaches build-output assets (chunks, fonts, public/
  // files) — it does NOT auto-precache route HTML/RSC payloads, so the
  // /offline fallback page must be added explicitly or it's never actually
  // available offline. Bump the revision string if offline/page.tsx changes.
  additionalPrecacheEntries: [{ url: '/offline', revision: 'v1' }]
})

/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = withSerwist(nextConfig)
