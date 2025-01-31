// src/quasar.js
import { createApp } from "vue";
import { Quasar } from "quasar";
import App from "../App.vue";
import quasarUserOptions from "app/.quasar/quasar-user-options"; // Ensure the App component is imported
import { CapacitorUpdater } from "@capgo/capacitor-updater";
import { Dialog } from "@capacitor/dialog";

CapacitorUpdater.addListener("updateAvailable", async (res) => {
  try {
    await Dialog.alert({
      title: "App update beschikbaar",
      message: `Version ${res.bundle.version} is beschikbaar. De app wordt nu bijgewerkt.`,
    });
    CapacitorUpdater.set(res.bundle);
  } catch (error) {
    console.log(error);
  }
});

CapacitorUpdater.notifyAppReady();

const app = createApp(App);
app.use(Quasar, quasarUserOptions);
