self.addEventListener("push", function (event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || "Nova notificação",
      icon: "/icon.svg",
      badge: "/icon.svg",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1,
        url: data.url || "/",
      },
      actions: [
        {
          action: "explore",
          title: "Ver mais",
          icon: "/icon.svg",
        },
        {
          action: "close",
          title: "Fechar",
          icon: "/icon.svg",
        },
      ],
    };

    event.waitUntil(
      self.registration.showNotification(data.title || "Notificação", options)
    );
  }
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  if (event.action === "explore") {
    const urlToOpen = event.notification.data.url || "/";
    event.waitUntil(
      clients.matchAll({ type: "window" }).then(function (clientList) {
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
    );
  }
});
