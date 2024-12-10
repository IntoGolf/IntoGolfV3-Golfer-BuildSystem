import { createApp } from "vue";
import store from "../store"; // Import your Vuex store
import App from "../App.vue"; // Ensure the App component is imported

const app = createApp(App);
app.use(store); // Use Vuex store
