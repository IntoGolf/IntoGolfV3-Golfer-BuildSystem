const state = {
  items: [],
};

const mutations = {
  SET_MESSAGES(state, items) {
    state.items = items;
  },
  CLEAR_VALUE(state) {
    state.items = [];
  },
};

const actions = {
  async fetchMessages({ commit, state }) {
    try {
      const response = await this.$axios.get("golfer/messages");
      commit("SET_MESSAGES", response.data);
    } catch (error) {
      console.error("There was an error fetching the messages!", error);
    }
  },
  async setMessage({ dispatch }, item) {
    try {
      await this.$axios.post("golfer/message", item);
      dispatch("fetchMessages");
    } catch (error) {
      console.error("There was an error fetching the messages!", error);
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
