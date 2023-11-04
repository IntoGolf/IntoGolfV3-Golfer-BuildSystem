import { boot } from "quasar/wrappers";
import dayjs from "dayjs";
import firebase from "firebase/app";
import "firebase/messaging";

let customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

require("dayjs/locale/nl");
dayjs.locale("NL");

let isBetween = require("dayjs/plugin/isBetween");
dayjs.extend(isBetween);

let isSameOrBefore = require("dayjs/plugin/isSameOrBefore");
dayjs.extend(isSameOrBefore);

let isToday = require("dayjs/plugin/isToday");
dayjs.extend(isToday);

export default boot(({ app }) => {
  // Firebase configuration object
  const firebaseConfig = {
    apiKey: "AIzaSyDOwcKOkup7E6qx5SXEXYqkyjRK7vo9bAk",
    authDomain: "golferapp-eda52.firebaseapp.com",
    projectId: "golferapp-eda52",
    storageBucket: "golferapp-eda52.appspot.com",
    messagingSenderId: "572456838586",
    appId: "1:572456838586:web:8fca0a21d61116a66da983",
  };

  console.log("a");
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();
  console.log("b");

  // Check if messaging is supported
  if (
    "Notification" in window &&
    "serviceWorker" in navigator &&
    "PushManager" in window
  ) {
    console.log("c");
    // Request permission for notifications (optional)
    messaging
      .getToken()
      .then((token) => {
        console.log("token");
        console.log(token);
        if (token) {
          // Handle the obtained FCM registration token
          localStorage.setItem("fcm_token", token);
        }
      })
      .catch((error) => {
        console.error("Error requesting notification permission:", error);
      });
    console.log("d");

    // Listen for incoming messages
    messaging.onMessage((payload) => {
      // Handle the received FCM message (when the app is in the foreground)
      console.log("FCM Message Received:", payload);
      // You can display the message or trigger custom actions here
    });
    console.log("e");
  } else {
    console.log("Push messaging is not supported in this browser.");
  }

  // Inject dayjs as a global property
  app.use(dayjs);
  app.config.globalProperties.$dayjs = dayjs;
});
