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
      console.log(data);
    });

    push.on("notification", (data) => {
      console.log("push_notification");
      alert(data.title);
    });

    push.on("error", (e) => {
      console.log("push_error");
      console.log(e);
    });

    // Make `push` available in all components
    // Vue.prototype.$push = push;
  }
};
