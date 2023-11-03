const state = {
  items: [],
};

const mutations = {
  SET_ITEMS(state, items) {
    state.items = items;
  },
  CLEAR_VALUE(state) {
    state.items = [];
  },
};

const actions = {
  async fetch({ commit, state }) {
    try {
      const response = await this.$axios.get("golfer/greenfee_card");
      commit("SET_ITEMS", response);
    } catch (error) {
      console.error("There was an error fetching the greenfeecards!", error);
    }
  },
  async clear({ commit }) {
    commit("CLEAR_VALUE");
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
