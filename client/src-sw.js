const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

precacheAndRoute(self.__WB_MANIFEST);

const offlineFallbackCacheName = 'offline-fallback-cache';

const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

registerRoute(({ request }) => request.mode === 'navigate', pageCache);

// TODO: Implement asset caching
registerRoute(
  ({ request }) => request.mode === 'navigate',
  async () => {
    try {
      const response = await fetch ('/');
      return response;
    } catch (error) {
      const cachedResponse = await caches.match('/index.html');
      if (cachedResponse) {
        return cachedResponse;
      } else {
        const offlineFallbackResponse = await caches.match(
          offlineFallbackCacheName
        );
        return offlineFallbackResponse;
      }
    }
  }
);

// offlineFallback({
//   cacheName: offlineFallbackCacheName,
//   plugins: [
//     new CacheableResponsePlugin({
//       statuses: [0, 200],
//     }),
//   ],
//   fallback: {
//     url: '/index.html',
//     cacheName: offlineFallbackCacheName,
//     plugins: [
//       new CacheableResponsePlugin({
//         statuses: [0, 200],
//       }),
//     ],
//   },
// });
