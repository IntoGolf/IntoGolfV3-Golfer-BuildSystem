const state = {
  circles: [],
  circle: null,
};

const mutations = {
  SET_CIRCLES(state, circles) {
    state.circles = circles;
  },
  SET_CIRCLE(state, circle) {
    state.circle = circle;
  },
  CLOSE_CIRCLE(state) {
    state.circle = null;
  },
  CLEAR_VALUE(state) {
    state.circles = [];
  },
};

const actions = {
  async fetchCircles({ commit, state }) {
    try {
      const response = await this.$axios.get("circle/list");
      commit("SET_CIRCLES", response.data);
    } catch (error) {
      console.error("There was an error fetching the circles!", error);
    }
  },
  async setCircle({ dispatch }, item) {
    try {
      await this.$axios.post("circle/set", item);
      dispatch("fetchCircles");
    } catch (error) {
      console.error("There was an error saving the circle!", error);
    }
  },
  async set({ commit }, item) {
    commit("SET_CIRCLE", item);
  },
  async delete({ dispatch, state }) {
    try {
      state.circle.cirActualYN = 0;
      await this.$axios.post("circle/set", state.circle);
      dispatch("fetchCircles");
      dispatch("close");
    } catch (error) {
      console.error("There was an error saving the circle!", error);
    }
  },
  async close({ commit }) {
    commit("CLOSE_CIRCLE");
  },
  async clear({ commit }) {
    commit("CLEAR_VALUE");
  },
};

const getters = {
  circles: (state) => state.circles,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
