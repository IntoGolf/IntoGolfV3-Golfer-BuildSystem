const state = {
  item: null,
  matchFilter: 0,
};

const mutations = {
  SET_CURRENT_USER(state, item) {
    state.item = item;
  },
  SET_VALUE(state, newValue) {
    state.matchFilter = newValue;
  },
  CLEAR_VALUE(state) {
    state.item = null;
    state.matchFilter = 0;
  },
};

const actions = {
  async login({ commit, state }, form) {
    try {
      const response = await this.$axios.post("golfer/login", form);

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
  usrHasLessons: (state) => {
    return (
      state.item &&
      typeof state.item === "object" &&
      "tile_lessons_y_n" in state.item &&
      state.item.tile_lessons_y_n
    );
  },
  usrHasShop: (state) => {
    return (
      state.item &&
      typeof state.item === "object" &&
      "tile_shop_y_n" in state.item &&
      state.item.tile_shop_y_n
    );
  },
  usrHasPos: (state) => {
    return (
      state.item &&
      typeof state.item === "object" &&
      "tile_horeca_y_n" in state.item &&
      state.item.tile_horeca_y_n
    );
  },
  usrHasMembers: (state) => {
    return (
      state.item &&
      typeof state.item === "object" &&
      "tile_members_y_n" in state.item &&
      state.item.tile_members_y_n
    );
  },
  usrHasHandicap: (state) => {
    return (
      state.item &&
      typeof state.item === "object" &&
      "tile_handicap_y_n" in state.item &&
      state.item.tile_handicap_y_n
    );
  },
  usrHasMatch: (state) => {
    return (
      state.item &&
      typeof state.item === "object" &&
      "tile_match_y_n" in state.item &&
      state.item.tile_match_y_n
    );
  },
  usrHasTeeTimes: (state) => {
    return (
      state.item &&
      typeof state.item === "object" &&
      "tile_teetimes_y_n" in state.item &&
      state.item.tile_teetimes_y_n
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
