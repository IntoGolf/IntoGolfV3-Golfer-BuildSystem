const state = {
  item: [],
  publicItems: [],
  fltNr: null,
};

const mutations = {
  SET_SETTINGS(state, item) {
    state.item = item;
  },
  SET_FLIGHT(state, fltNr) {
    state.fltNr = fltNr;
  },
  CLEAR_FLIGHT(state, fltNr) {
    state.fltNr = null;
  },
  SET_PUBLIC_SETTINGS(state, item) {
    state.publicItems = item;
  },
  CLEAR_VALUE(state) {
    state.item = [];
    state.publicItems = [];
  },
  CLEAR_PUBLIC_VALUE(state) {
    state.publicItems = [];
  },
};

const actions = {
  async fetchSettings({ commit, state }) {
    try {
      const response = await this.$axios.get("golfer/settings");
      commit("SET_SETTINGS", response);
      return response;
    } catch (error) {
      console.error("There was an error fetching the settings!", error);
    }
  },
  async fetchPublicSettings({ commit, state }) {
    try {
      const response = await this.$axios.get("golfer/psettings");
      commit("SET_PUBLIC_SETTINGS", response);
    } catch (error) {
      console.error("There was an error fetching the settings!", error);
    }
  },
  async clear({ commit }) {
    commit("CLEAR_VALUE");
  },
  async clearPublic({ commit }) {
    commit("CLEAR_PUBLIC_VALUE");
  },
};

const getters = {
  item: (state) => state.item,
  publicItems: (state) => state.publicItems,
  isItemEmpty: (state) => {
    return state.item.length === 0 && Object.keys(state.item).length === 0;
  },
  isPublicEmpty: (state) => {
    return (
      state.publicItems.length === 0 &&
      Object.keys(state.publicItems).length === 0
    );
  },
  setHasCircles: (state) => {
    return (
      state.item &&
      typeof state.item === "object" &&
      "app_display_circles_tile" in state.item &&
      state.item.app_display_circles_tile === 1
    );
  },
  setHasCalendar: (state) => {
    return (
      state.item &&
      typeof state.item === "object" &&
      "app_display_calendar_tile" in state.item &&
      state.item.app_display_calendar_tile === 1
    );
  },
  setHasBalance: (state) => {
    return (
      state.item &&
      typeof state.item === "object" &&
      "app_display_balance" in state.item &&
      state.item.app_display_balance === 1
    );
  },
  setHasGreenFeeCard: (state) => {
    return (
      state.item &&
      typeof state.item === "object" &&
      "app_display_greenfeecard" in state.item &&
      state.item.app_display_greenfeecard
    );
  },
  setHasMessages: (state) => {
    return (
      state.item &&
      typeof state.item === "object" &&
      "app_display_message_tile" in state.item &&
      state.item.app_display_message_tile === 1
    );
  },
  setHasCourseStatus: (state) => {
    return (
      state.item &&
      typeof state.item === "object" &&
      "app_display_course_status_tile" in state.item &&
      state.item.app_display_course_status_tile === 1
    );
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
