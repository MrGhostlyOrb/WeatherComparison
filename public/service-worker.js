'use strict';

//Update cache names any time any of the cached files change.
const CACHE_NAME = 'static-cache-v1';

//List of files to cache locally
const FILES_TO_CACHE = [
'/',
'/weather',
'/styles/style.css',
'/scripts/app.js',
'/manifest.json',
'/images/bg-night.png',
'/images/bg-day.png',
//'/socket.io/socket.io.js'
];
var offline = false;
self.addEventListener('message', (evt) => {
	console.log(evt.data);
	if(evt.data === true){
		offline = true;
	}
	else if(evt.data === false){
		offline = false;
	}
	else{
		console.log("There was an error");
	}
});

//Launch when install button clicked
self.addEventListener('install', (evt) => {
  console.log('[ServiceWorker] Install');
evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching offline page');
      return cache.addAll(FILES_TO_CACHE);
    })
);
  self.skipWaiting();
});

//Wait for activate event
self.addEventListener('activate', (evt) => {
  console.log('[ServiceWorker] Activate');
  // CODELAB: Remove previous cached data from disk.
evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
);
  self.clients.claim();
});


//Wait for fetch event
self.addEventListener('fetch', (evt) => {
  console.log('[ServiceWorker] Fetch', evt.request.url);

	if(offline === false){
	console.log('[ServiceWorker] Fetching from network')
	evt.respondWith(
    	fetch(evt.request)
        	.catch(() => {
        		console.log('[ServiceWorker] Network failed using cache');
        		console.log(evt.request);
          		return caches.open(CACHE_NAME)
              		.then((cache) => {
                		return cache.match(evt.request);
              				});
        })
);
}
else if(offline === true){
	console.log('[ServiceWorker] Fetching from cache')
	evt.respondWith(
		caches.open(CACHE_NAME)
              		.then((cache) => {
                		return cache.match(evt.request);
              				}));}
              				else{
              					console.log("Error with cache");
              				}

});
