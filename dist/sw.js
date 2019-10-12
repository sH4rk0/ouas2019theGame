importScripts("precache-manifest.f9bbd806fa898626c7a47f5215bedf05.js", "https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

var cacheName = 'ouas-2019-v1';
var filesToCache = [
    '/',
    '/index.html'
];

self.addEventListener('install', function (event) {
    console.log('sw install');
    event.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log('sw caching files');
            return cache.addAll(filesToCache);
        }).catch(function (err) {
            console.log(err);
        })
    );
});


self.addEventListener('fetch', (event) => {
    //console.log('sw fetch');
    //console.log(event.request.url);
    event.respondWith(
        caches.match(event.request).then(function (response) {
            return response || fetch(event.request);
        }).catch(function (error) {
            console.log(error);
        })
    );
});

self.addEventListener('activate', function (event) {
    console.log('sw activate');
    event.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (key !== cacheName) {
                    console.log('sw removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
});
