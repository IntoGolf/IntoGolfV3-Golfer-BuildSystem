const state = {
  items: [],
};

const mutations = {
  SET_ITEMS(state, items) {
    state.items = items;
  },
  CLEAR_ITEMS(state) {
    state.items = [];
  },
};

const actions = {
  async fetchItems({ commit, state }) {
    try {
      const response = await this.$axios.get("golfer/bills");
      commit("SET_ITEMS", response);
    } catch (error) {
      console.error("There was an error fetching the messages!", error);
    }
  },
  async clear({ commit }) {
    commit("CLEAR_ITEMS");
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
