// src/store/index.js
import { createStore } from "vuex";
import messages from "./messages"; // Import your messages module
import scorecards from "./scorecards"; // Import your messages module
import countries from "./countries"; // Import your messages module
import settings from "./settings"; // Import your messages module
import currentUser from "./currentUser";
import courseStatus from "./courseStatus";
import greenfeeCards from "./greenfeeCards";
import circles from "./circles";

const store = createStore({
  modules: {
    messages,
    scorecards,
    countries,
    settings,
    currentUser,
    courseStatus,
    greenfeeCards,
    circles,
  },
  actions: {
    async initializeApp({ dispatch }) {
      await dispatch("settings/fetchSettings", null, { root: true });
      await dispatch("currentUser/fetch", null, { root: true });
      await dispatch("messages/fetchMessages", null, { root: true });
      await dispatch("courseStatus/fetch", null, { root: true });
      // await dispatch("circles/fetchCircles", null, { root: true });
    },
    async initializePublicApp({ dispatch }) {
      await dispatch("settings/fetchPublicSettings", null, { root: true });
    },
    async clearState({ dispatch }) {
      await dispatch("countries/clear");
      await dispatch("courseStatus/clear");
      await dispatch("currentUser/clear");
      await dispatch("greenfeeCards/clear");
      await dispatch("messages/clear");
      await dispatch("scorecards/clear");
      await dispatch("settings/clear");
      await dispatch("circles/clear");
    },
  },
});

export default store;
