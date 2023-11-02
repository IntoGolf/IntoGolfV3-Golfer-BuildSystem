const state = {
  items: [],
};

const mutations = {
  SET_ITEMS(state, items) {
    state.items = items;
  },
};

const actions = {
  async fetch({ commit, state }) {
    try {
      const response = await this.$axios.get("golfer/courseStatus");
      commit("SET_ITEMS", response);
    } catch (error) {
      console.error("There was an error fetching the courseStatus!", error);
    }
  },
};

const getters = {
  items: (state) => state.items,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
