import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'QRZ Ready',
    short_name: 'QRZ Ready',
    description: 'Memorization-focused study tool for Amateur Radio license exams.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0e1117',
    theme_color: '#0e1117',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
    ]
  };
}
