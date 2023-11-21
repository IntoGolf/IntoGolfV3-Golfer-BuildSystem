export default async ({ Vue }) => {
  console.log("deviceready");
  document.addEventListener("deviceready", onDeviceReady, false);

  function onDeviceReady() {
    console.log("device is ready");
    const push = PushNotification.init({
      android: {
        sound: "true",
      },
      ios: {
        alert: "true",
        badge: "true",
        sound: "true",
        clearBadge: "true", // Set to true to clear the badge number on the app icon when the app starts
      },
    });

    push.on("registration", (data) => {
      console.log("Registration token:", data.registrationId);
      console.log(JSON.stringify(data));
    });

    // Notification received when app is in foreground
    push.on("notification", (data) => {
      console.log("push_notification");
      cordova.plugins.notification.local.schedule({
        title: data.title,
        text: data.message,
        foreground: true,
      });
    });

    push.on("error", (e) => {
      console.log("push_error");
      console.log(e);
    });

    cordova.plugins.notification.local.on("click", function (notification) {
      console.log("notification clicked");
      console.log(notification);
    });
    // Make `push` available in all components
    // Vue.prototype.$push = push;
  }
};
