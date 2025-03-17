// eslint-disable-next-line
// @ts-nocheck

// https://nextjs.org/docs/app/building-your-application/configuring/progressive-web-apps#5-creating-a-service-worker
// this file only exists to override the old service worker from create-react-app

// Service worker to clean up old create-react-app service worker and caches
addEventListener('install', () => {
  skipWaiting() // Ensure the new service worker activates immediately
})

addEventListener('activate', () => {
  event.waitUntil(
    Promise.all([
      // Clear all caches
      caches.keys().then(function (cacheNames) {
        return Promise.all(
          cacheNames.map(function (cacheName) {
            return caches.delete(cacheName)
          }),
        )
      }),
      // Unregister all service workers
      (async () => {
        if ('serviceWorker' in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations()
          for (const registration of registrations) {
            await registration.unregister()
          }
        }
      })(),
      // Take control of all clients
      clients.claim(),
    ]),
  )
})

// Prevent any caching by intercepting all fetch requests
addEventListener('fetch', (event: FetchEvent) => {
  event.respondWith(
    fetch(event.request, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
      },
    }),
  )
})
