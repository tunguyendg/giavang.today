self.addEventListener("install", () => {
  console.log("Service Worker installed");
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  console.log("Service Worker activated");
});

self.addEventListener("push", (event) => {
  console.log("Push received");

  const data = event.data
    ? event.data.json()
    : {
        title: "giavang.today",
        body: "Có thông báo mới",
      };

  console.log("Push data:", data);

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
    })
  );
});