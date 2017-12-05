importScripts('workbox-sw.prod.v2.1.2.js');

importScripts('/src/js/idb.js');
importScripts('/src/js/db.js');

const workboxSW = new self.WorkboxSW();

workboxSW.router.registerRoute(/.*(?:googleapis|gstatic)\.com.*$/, workboxSW.strategies.staleWhileRevalidate({
    cacheNmae: 'google-fonts',
    cacheExpiration: {
        maxEntries: 3,
        maxAgeSeconds: 60 * 60 * 24 * 30
    }
}));

workboxSW.router.registerRoute('https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css', workboxSW.strategies.staleWhileRevalidate({
    cacheNmae: 'material-design-css'
}));

workboxSW.router.registerRoute(/.*(?:firebasestorage\.googleapis)\.com.*$/, workboxSW.strategies.staleWhileRevalidate({
    cacheNmae: 'post-images'
}));

workboxSW.router.registerRoute('https://test-183c9.firebaseio.com/posts', function(args) {
    return fetch(arg.event.request)
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
});

workboxSW.router.registerRoute(function(routeData) {
    return (routeData.event.request.headers.get('accept').includes('text/html'));
}, function(args) {
    return caches.match(args.event.request)
        .then(function(response) {
            if(response) {
                return response;
            }else {
                return fetch(args.event.request)
                    .then(function(res) {
                        return caches.open('dynamic')
                            .then(function(cache) {
                                cache.put(args.event.request.url, res.clone());
                                return res;
                            })
                    })
                    .catch(function(err) {
                        return caches.open('/offline.html')
                            .then(function(cache) {
                                return cache;
                            })
                    });
            }
        })
});

workboxSW.precache([
  {
    "url": "404.html",
    "revision": "0a27a4163254fc8fce870c8cc3a3f94f"
  },
  {
    "url": "favicon.ico",
    "revision": "395d99931d8b528940abb4833f807c33"
  },
  {
    "url": "index.html",
    "revision": "23f6969f0e9b472a9da9ad4381f7b8b4"
  },
  {
    "url": "manifest.json",
    "revision": "682704a258fda660cb4fe027938b7233"
  },
  {
    "url": "offline.html",
    "revision": "3216d307ffadcf8432638eeaafe7a6c8"
  },
  {
    "url": "service-worker.js",
    "revision": "8e51a29285e6674922cdca6e03879b52"
  },
  {
    "url": "src/css/app.css",
    "revision": "a4936f8f649c0caf3b8eed8aa88b77f3"
  },
  {
    "url": "src/css/feed.css",
    "revision": "b9262a482a90898a794fc98d368f3910"
  },
  {
    "url": "src/css/help.css",
    "revision": "89010b6ab74a0e9d75f353cbb1fafe23"
  },
  {
    "url": "src/js/app.js",
    "revision": "be7294c1332748a2e577c26af3ef6d5a"
  },
  {
    "url": "src/js/db.js",
    "revision": "0cba76012e74141998a9179a368f9aec"
  },
  {
    "url": "src/js/feed.js",
    "revision": "33ccf5ced8a2c52b0fff406ea4e68cc8"
  },
  {
    "url": "src/js/fetch.js",
    "revision": "6b82fbb55ae19be4935964ae8c338e92"
  },
  {
    "url": "src/js/idb.js",
    "revision": "017ced36d82bea1e08b08393361e354d"
  },
  {
    "url": "src/js/material.min.js",
    "revision": "441229a9d807eaec2c0156bccb5dcab9"
  },
  {
    "url": "src/js/promise.js",
    "revision": "10c2238dcd105eb23f703ee53067417f"
  },
  {
    "url": "sw-custom.js",
    "revision": "e1d783ee2ffe32a2fc4eaa2b0ff5f9d9"
  },
  {
    "url": "sw.js",
    "revision": "d120f95b877f95fb4eab1e6da9c480b7"
  },
  {
    "url": "workbox-sw.prod.v2.1.2.js",
    "revision": "685d1ceb6b9a9f94aacf71d6aeef8b51"
  },
  {
    "url": "src/images/main.jpg",
    "revision": "8fabd0a578e27901f1ed98e6613cf1f9"
  }
]);