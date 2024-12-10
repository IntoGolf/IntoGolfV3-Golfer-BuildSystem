// src/quasar.js
import { createApp } from "vue";
import { Quasar } from "quasar";
import App from "../App.vue";
import quasarUserOptions from "app/.quasar/quasar-user-options"; // Ensure the App component is imported
import { CapacitorUpdater } from "@capgo/capacitor-updater";

CapacitorUpdater.notifyAppReady();

const app = createApp(App);
app.use(Quasar, quasarUserOptions);
