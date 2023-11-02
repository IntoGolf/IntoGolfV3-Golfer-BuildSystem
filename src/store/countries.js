const state = {
  countries: [],
};

const mutations = {
  SET_COUNTRIES(state, countries) {
    state.countries = countries;
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
