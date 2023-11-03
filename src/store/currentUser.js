const state = {
  item: [],
  matchFilter: 0,
};

const mutations = {
  SET_CURRENT_USER(state, item) {
    state.item = item;
  },
  SET_VALUE(state, newValue) {
    state.matchFilter = newValue;
  },
  CLEAR_VALUE(state, newValue) {
    state.item = [];
    state.matchFilter = 0;
  },
};

const actions = {
  async login({ commit, state }, { relEmail, repPassword, captcha }) {
    try {
      const response = await this.$axios.post("golfer/login", {});
      commit("SET_CURRENT_USER", response);
    } catch (error) {
      console.error("There was an error fetching the user!", error);
    }
  },
  async fetch({ commit, state }) {
    try {
      const response = await this.$axios.get("golfer/user");
      commit("SET_CURRENT_USER", response);
    } catch (error) {
      console.error("There was an error fetching the user!", error);
    }
  },
  async updateMatchFilter({ commit }, newValue) {
    commit("SET_VALUE", newValue);
  },
  async clear({ commit }) {
    commit("CLEAR_VALUE");
  },
};

const getters = {
  item: (state) => state.item,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
