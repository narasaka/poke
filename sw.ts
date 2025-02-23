/// <reference lib="webworker" />
declare let self: ServiceWorkerGlobalScope;

console.log("Service worker registered");

self.addEventListener("install", () => {
  console.log("Service worker installing.");
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  console.log("Service worker activating.");
  self.clients.claim();
  console.log("Service worker activated and claiming clients.");
});

self.addEventListener("push", (event) => {
  console.log("Push notification received", event);
  let title = "Push Notification";
  let body = "This is a push notification from the server.";
  let icon = "pwa-512x512.png"; // Path to your icon in public dir
  let data = { testData: "hardcoded" };

  console.log("Notification parameters:", { title, body, icon, data }); // Verify parameters

  if (event.data) {
    const pushData = event.data.json();
    title = pushData.title || title;
    body = pushData.body || body;
    icon = pushData.icon || icon;
    data = pushData.data || data;
  }

  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: icon,
      data: data,
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked", event);
  event.notification.close();
  self.clients.openWindow("/");
});

self.addEventListener("notificationclose", (event) => {
  console.log("Notification closed", event);
});
