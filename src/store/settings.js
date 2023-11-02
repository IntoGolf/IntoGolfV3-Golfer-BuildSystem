const state = {
  item: [],
  publicItems: [],
};

const mutations = {
  SET_SETTINGS(state, item) {
    state.item = item;
  },
  SET_PUBLIC_SETTINGS(state, item) {
    state.publicItems = item;
  },
};

const actions = {
  async fetchSettings({ commit, state }) {
    try {
      const response = await this.$axios.get("golfer/settings");
      commit("SET_SETTINGS", response);
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
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
