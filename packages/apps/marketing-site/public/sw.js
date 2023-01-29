/* eslint-disable no-restricted-globals */
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    (async () => {
      if (!navigator?.serviceWorker) return;
      const workers = await navigator.serviceWorker.getRegistrations();

      if (workers.length) {
        await Promise.all(workers.map(w => w.unregister()));
        location.reload();
      }
    })()
  );
});
