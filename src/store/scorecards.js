const state = {
  scorecards: [],
};

const mutations = {
  SET_SCORECARDS(state, scorecards) {
    state.scorecards = scorecards;
  },
  CLEAR_VALUE(state) {
    state.scorecards = [];
  },
};

const actions = {
  async fetchScorecards({ commit, state }) {
    try {
      const response = await this.$axios.get("golfer/scorecards");
      commit("SET_SCORECARDS", response);
    } catch (error) {
      console.error("There was an error fetching the scorecards!", error);
    }
  },
  async setScorecard({ dispatch }, item) {
    try {
      await this.$axios.post("golfer/scorecard", item);
      dispatch("fetchScorecards");
    } catch (error) {
      console.error("There was an error saving the scorecard!", error);
    }
  },
  async clear({ commit }) {
    commit("CLEAR_VALUE");
  },
};

const getters = {
  scorecards: (state) => state.scorecards,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
