// advanced config for injectManifest approach
importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

workbox.precaching.precacheAndRoute([]);

workbox.routing.registerRoute(
    new RegExp('https://api.currencystack.io'),
    new workbox.strategies.CacheFirst()
);

// default page handler for offline usage,
// where the browser does not how to handle deep links
// it's a SPA, so each path that is a navigation should default to index.html
workbox.routing.registerRoute(
    ({ event }) => event.request.mode === 'navigate',
    async () => {
        const defaultBase = '/index.html';
        return caches
            .match(workbox.precaching.getCacheKeyForURL(defaultBase))
            .then(response => {
                return response || fetch(defaultBase);
            })
            .catch(err => {
                console.debug(err);
                return fetch(defaultBase);
            });
    }
);

// Background sync
const queue = new workbox.backgroundSync.Queue('eventsQueue');

self.addEventListener('fetch', (event) => {
    // Clone the request to ensure it's safe to read when adding to the Queue
    const promiseChain = fetch(event.request.clone())
    .then(e => console.log('sync... ', e))
        .catch((err) => {
            console.debug(err);
            return queue.pushRequest({ request: event.request });
        });

    event.waitUntil(promiseChain);
});
