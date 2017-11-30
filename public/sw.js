importScripts('/src/js/idb.js');
importScripts('/src/js/db.js');

var CACHE_STATIC = 'static-v1';
var CACHE_DYNAMIC = 'dynamic-v1';
var STATIC_FILES = [
    '/',
    '/index.html',
    '/src/js/app.js',
    '/src/js/feed.js',
    '/src/js/idb.js',
    '/src/js.db.js',
    '/src/js/promise.js',
    '/src/js/fetch.js',
    '/src/js/material.min.js',
    '/src/css/app.css',
    '/src/css/feed.css',
    '/src/images/main.jpg',
    'https://fonts.googleapis.com/css?family=Roboto:400,700',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
]

self.addEventListener('install', function(event) {
    console.log('[Service Worker] Installing Service Worker', event);
    event.waitUntil(
        caches.open(CACHE_STATIC)
            .then(function(cache) {
                console.log('[Service Worker] App Shell precachching');
                cache.addAll(STATIC_FILES);
            })
    )
});

self.addEventListener('activate', function(event) {
    console.log('[Service Worker] Activating Service Worker', event);
    event.waitUntil(
        caches.keys()
            .then(function(keyList) {
                return Promise.all(keyList.map(function(key) {
                    if(key !== CACHE_STATIC && key !== CACHE_DYNAMIC){
                        console.log('[Service Worker] Remove old cache.', key);
                        return caches.delete(key);
                    }
                }));
            })
        )
    return self.clients.claim();
});

function isInArray(string, array) {
    var cachePath;
    if (string.indexOf(self.origin) === 0) { // request targets domain where we serve the page from (i.e. NOT a CDN)
        console.log('matched ', string);
        cachePath = string.substring(self.origin.length); // take the part of the URL AFTER the domain (e.g. after localhost:8080)
    } else {
        cachePath = string; // store the full request (for CDNs)
    }
    return array.indexOf(cachePath) > -1;
}



self.addEventListener('fetch', function(event) {
    console.log('[Service Worker] Fetching Data', event);
    var url = 'https://test-183c9.firebaseio.com/posts';
    if(event.request.url.indexOf(url) > -1){
        event.respondWith(fetch(event.request)
            .then(function(res) {
                var clonedRes = res.clone();
                clearAllData('posts')
                    .then(function() {
                        return clonedRes.json();
                    })
                    .then(function(data) {
                        for(var key in data){
                            writeData('posts', data[key])
                        }
                    });
                return res;
            })
        );
    } else if(isInArray(event.request.url, STATIC_FILES)) {
        event.waitUntil(
            caches.match(event.request)
        );
    } else {
        event.respondWith(
            caches.match(event.request)
                .then(function(response) {
                    if(response) {
                        return response;
                    }else {
                        return fetch(event.request)
                            .then(function(res) {
                                return caches.open(CACHE_DYNAMIC)
                                    .then(function(cache) {
                                        cache.put(event.request.url, res.clone());
                                        return res;
                                    })
                            })
                            .catch(function(err) {
                                return caches.open(CACHE_STATIC)
                                    .then(function(cache) {
                                        if(event.request.headers.get('accept').includes('text/html')) {
                                            return cache.match('/offline.html');
                                        }
                                    })
                            });
                    }
                })
        );
    }
});

self.addEventListener('sync', function(event) {
    console.log('[Service Worker] Background Syncing', event);
    if (event.tag === 'sync-new-posts') {
        console.log('[Service Worker] Syncing new Posts');
        event.waitUntil(
            readAllData('sync-posts')
                .then(function(data) {
                    for (var dt of data) {
                        var postData = new FormData();
                        postData.append('id', dt.id);
                        postData.append('title', dt.title);
                        postData.append('location', dt.location);
                        postData.append('rawLocationLat', dt.rawLocation.lat);
                        postData.append('rawLocationLng', dt.rawLocation.lng)
                        postData.append('file', dt.picture, dt.id + '.png');
                        fetch('https://us-central1-test-183c9.cloudfunctions.net/storePostData', {
                            method: 'POST',
                            body: postData
                        })
                        .then(function(res) {
                            console.log('Sent data', res);
                            if (res.ok) {
                            res.json()
                                .then(function(resData) {
                                deleteItemFromData('sync-posts', resData.id);
                                });
                            }
                        })
                        .catch(function(err) {
                            console.log('Error while sending data', err);
                        });
                    }
    
                })
        );
    }
});

self.addEventListener('notificationclick', function(event) {
    var notification = event.notification;
    var action = event.action;
    console.log('Notification : ', notification);
    console.log('Action : ', action);
    if(action === 'confirm'){
        notification.close();
    }else{
        event.waitUntil(
            clients.matchAll()
            .then(function(clis) {
                var client = clis.find(function(c) {
                    return c.visibilityState === 'visible';
                });
                if (client !== undefined) {
                    client.navigate(notification.data.url);
                    client.focus();
                } else {
                    clients.openWindow(notification.data.url);
                }
                notification.close();
            })
        )
    }
});

self.addEventListener('notificationclose', function(event) {
    console.log('Notification Closed!', event);
});

self.addEventListener('push', function(event) {
    console.log('Push messeage recieved!', event);
    var data = { title: 'New message', content: 'I wanna happy', openUrl: '/' };

    if(event.data){
        data = JSON.parse(event.data.text());
    }

    var options = {
        body: data.content,
        icon: '/src/images/icons/android-icon-96x96.png',
        bagde: '/src/images/icons/android-icon-96x96.png',
        data: {
            url: data.openUrl
        }
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
})

// Trim Cache Function
// function trimCache(cacheName, maxItems) {
//   caches.open(cacheName)
//     .then(function (cache) {
//       return cache.keys()
//         .then(function (keys) {
//           if (keys.length > maxItems) {
//             cache.delete(keys[0])
//               .then(trimCache(cacheName, maxItems));
//           }
//         });
//     })
// }

// Cache-only
// self.addEventListener('fetch', function (event) {
//   event.respondWith(
//     caches.match(event.request)
//   );
// });

// Network-only
// self.addEventListener('fetch', function (event) {
//   event.respondWith(
//     fetch(event.request)
//   );
// });