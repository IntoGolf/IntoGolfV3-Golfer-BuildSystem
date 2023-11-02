// src/quasar.js
import { createApp } from "vue";
import { Quasar } from "quasar";
import quasarUserOptions from "./quasar-user-options";
import store from "./store"; // Import your store

const app = createApp(App);

app.use(Quasar, quasarUserOptions);
app.use(store); // Add this line to include your Vuex store

app.mount("#app");
