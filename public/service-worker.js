importScripts('workbox-sw.prod.v2.1.2.js');

/**
 * DO NOT EDIT THE FILE MANIFEST ENTRY
 *
 * The method precache() does the following:
 * 1. Cache URLs in the manifest to a local cache.
 * 2. When a network request is made for any of these URLs the response
 *    will ALWAYS comes from the cache, NEVER the network.
 * 3. When the service worker changes ONLY assets with a revision change are
 *    updated, old cache entries are left as is.
 *
 * By changing the file manifest manually, your users may end up not receiving
 * new versions of files because the revision hasn't changed.
 *
 * Please use workbox-build or some other tool / approach to generate the file
 * manifest which accounts for changes to local files and update the revision
 * accordingly.
 */
const fileManifest = [
  {
    "url": "404.html",
    "revision": "0a27a4163254fc8fce870c8cc3a3f94f"
  },
  {
    "url": "favicon.ico",
    "revision": "395d99931d8b528940abb4833f807c33"
  },
  {
    "url": "help/index.html",
    "revision": "6d46dc445788f1ff01b99e3807eccbeb"
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
    "url": "src/images/icons/android-icon-144x144.png",
    "revision": "4ea77e9ccd18b48c475d194756d00fcd"
  },
  {
    "url": "src/images/icons/android-icon-192x192.png",
    "revision": "4def347620ebd231bf95a05bb59cdeac"
  },
  {
    "url": "src/images/icons/android-icon-48x48.png",
    "revision": "7ddd40c580ea58d3a12b82afc6e0cbe4"
  },
  {
    "url": "src/images/icons/android-icon-72x72.png",
    "revision": "26b895472ef456eac345af0f7e23383c"
  },
  {
    "url": "src/images/icons/android-icon-96x96.png",
    "revision": "e1f1719350315adcac33a8dbae5af231"
  },
  {
    "url": "src/images/icons/apple-icon-114x114.png",
    "revision": "ddcb53256ffe691f1a77ac365c4dbaf9"
  },
  {
    "url": "src/images/icons/apple-icon-120x120.png",
    "revision": "eb1e9c8bcb9bb1e8947b437b60b8b89e"
  },
  {
    "url": "src/images/icons/apple-icon-144x144.png",
    "revision": "4ea77e9ccd18b48c475d194756d00fcd"
  },
  {
    "url": "src/images/icons/apple-icon-152x152.png",
    "revision": "cbe8de7d37b5e38423e324abab4b6b28"
  },
  {
    "url": "src/images/icons/apple-icon-180x180.png",
    "revision": "c26e7b17b0ee243cb5c114ab7d8d5c54"
  },
  {
    "url": "src/images/icons/apple-icon-57x57.png",
    "revision": "3e69c8432ac357a179c3f9665afc809f"
  },
  {
    "url": "src/images/icons/apple-icon-60x60.png",
    "revision": "e359ba65a0490c2f23fee016b088e32b"
  },
  {
    "url": "src/images/icons/apple-icon-72x72.png",
    "revision": "26b895472ef456eac345af0f7e23383c"
  },
  {
    "url": "src/images/icons/apple-icon-76x76.png",
    "revision": "8f924652903fc71e879f998a129b2a77"
  },
  {
    "url": "src/images/main.jpg",
    "revision": "8fabd0a578e27901f1ed98e6613cf1f9"
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
    "url": "sw.js",
    "revision": "d120f95b877f95fb4eab1e6da9c480b7"
  }
];

const workboxSW = new self.WorkboxSW();
workboxSW.precache(fileManifest);
