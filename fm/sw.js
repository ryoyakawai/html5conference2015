/* sw.js */
importScripts('serviceworker-cache-polyfill.js');
var CACHE_NAME = 'html5conference2015-fm-cache';
var urlsToCache = [
    './index.html',
    './bower_components/x-webmidi/x-webmidirequestaccess.html',
    './components/polymer_analyser.html',
    './bower_components/webaudio-controls/lib/webaudio-controls.min.html',
    './css/fm00-02.css',
    './sw.js',
    './register_sw.js',
    './js/fm00-02.js'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
      caches.open(CACHE_NAME)
          .then(function(cache) {
              //console.log('Opened cache');
              return cache.addAll(urlsToCache);
          })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
      caches.match(event.request)
          .then(function(response) {
              if (response) {
                  //console.log("[return cache] ", (response.url).split("/").pop());
                  return response;
              }
              var fetchRequest = event.request.clone();

              return fetch(fetchRequest)
                  .then(function(response) {
                      if (!response || response.status !== 200 || response.type !== 'basic') {
                          return response;
                      }
                      
                      var responseToCache = response.clone();

                      caches.open(CACHE_NAME)
                          .then(function(cache) {
                              cache.put(event.request, responseToCache);
                          });
                      
                      return response;
                  });
          })
  );
});

