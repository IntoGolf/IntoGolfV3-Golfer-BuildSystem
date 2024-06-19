// Import the Firebase messaging module
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js"
);

// Initialize the Firebase app in the service worker by passing the messagingSenderId.
firebase.initializeApp({
  apiKey: "AIzaSyDOwcKOkup7E6qx5SXEXYqkyjRK7vo9bAk",
  authDomain: "golferapp-eda52.firebaseapp.com",
  projectId: "golferapp-eda52",
  storageBucket: "golferapp-eda52.appspot.com",
  messagingSenderId: "572456838586",
  appId: "1:572456838586:web:8fca0a21d61116a66da983",
});

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

// Optional: If you want to handle background messages, you can do so by passing a callback to setBackgroundMessageHandler.
messaging.setBackgroundMessageHandler(function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );

  // Customize notification here
  const notificationTitle = "Background Message Title";
  const notificationOptions = {
    body: "Background Message body.",
    icon: "/firebase-logo.png",
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});
