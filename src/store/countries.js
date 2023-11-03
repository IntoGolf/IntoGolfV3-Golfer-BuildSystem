const state = {
  countries: [],
};

const mutations = {
  SET_COUNTRIES(state, countries) {
    state.countries = countries;
  },
  CLEAR_VALUE(state, newValue) {
    state.countries = [];
  },
};

const actions = {
  async fetchCountries({ commit, state }) {
    try {
      const response = await this.$axios.get("golfer/countries");
      commit("SET_COUNTRIES", response);
    } catch (error) {
      console.error("There was an error fetching the countries!", error);
    }
  },
  async clear({ commit }) {
    commit("CLEAR_VALUE");
  },
};

const getters = {
  countries: (state) => state.countries,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
