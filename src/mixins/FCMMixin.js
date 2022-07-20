export default {
  data() {
    return {
      firebaseSubscribeTopic: "golfer-all",
    };
  },
  methods: {
    getToken() {
      FirebasePlugin.getToken(
        function (token) {
          console.log("Got FCM token: " + token);
        },
        function (error) {
          console.error("Failed to get FCM token", error);
        }
      );
    },
    subscribe() {
      let topic = this.firebaseSubscribeTopic;
      FirebasePlugin.subscribe(
        topic,
        function () {
          console.log(`Subscribed to topic: ${topic}`);
        },
        function (error) {
          console.error("Failed to subscribe to topic", error);
        }
      );
    },
    checkNotificationPermission(requested) {
      FirebasePlugin.grantPermission(
        function () {
          console.log("grant permission success");
        },
        function (error) {
          console.error("grant permission failed", error);
        }
      );
      FirebasePlugin.hasPermission((hasPermission) => {
        if (hasPermission) {
          console.log("Remote notifications permission granted");
          // Granted
          this.getToken();
        } else if (!requested) {
          // Request permission
          console.log("Requesting remote notifications permission");
          FirebasePlugin.grantPermission(
            this.checkNotificationPermission.bind(this, true)
          );
        } else {
          // Denied
          console.error("Notifications won't be shown as permission is denied");
        }
      });
    },
  },
};
