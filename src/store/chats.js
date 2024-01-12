import Pusher from "pusher-js";

// Initialize Pusher
let pusher;
if (typeof process !== "undefined" && process.env.PUSHER_APP_KEY) {
  // Initialize Pusher only if PUSHER_APP_KEY is set
  pusher = new Pusher(process.env.PUSHER_APP_KEY, {
    cluster: process.env.PUSHER_APP_CLUSTER,
    encrypted: true,
  });
}

const state = {
  chats: [],
  chat: null,
  edit: false,
  channels: {}, // New state property for managing Pusher channels
  messages: [],
  relations: [],
};

const mutations = {
  SET_CHATS(state, chats) {
    state.chats = chats;
    state.chats.forEach((chat) => {
      this.dispatch("chats/subscribeToChatChannel", chat.chtNr);
    });
  },
  SET_MESSAGES(state, messages) {
    state.messages = messages;
  },
  SET_RELATIONS(state, relations) {
    state.relations = relations;
  },
  SET_CHAT(state, chat) {
    state.chat = chat;
  },
  CLOSE_CHATS(state) {
    state.chats.forEach((chat) => {
      this.dispatch("chats/unsubscribeFromChatChannel", chat.chtNr);
    });
    state.chat = null;
    state.relations = [];
    state.messages = [];
  },
  CLOSE_CHAT(state) {
    state.chat = null;
    state.relations = [];
    state.messages = [];
  },
  CLEAR_VALUE(state) {
    state.chats = [];
  },
  SET_EDIT(state, value) {
    state.edit = value;
  },
  UPDATE_CHAT(state, updatedChat) {
    const index = state.chats.findIndex(
      (chat) => chat.chtNr === updatedChat.crmChtNr
    );
    if (index !== -1) {
      state.messages.unshift(updatedChat);
    }
  },
  // Mutation to manage Pusher channel references
  SET_CHANNEL(state, { chtNr, channel }) {
    state.channels[chtNr] = channel;
  },
  REMOVE_CHANNEL(state, chtNr) {
    if (state.channels[chtNr]) {
      delete state.channels[chtNr];
    }
  },
};

const actions = {
  async fetchChats({ dispatch, commit, state }, onlyRefresh = false) {
    console.log("fetchChats");
    pusher = new Pusher(process.env.PUSHER_APP_KEY, {
      cluster: process.env.PUSHER_APP_CLUSTER,
      encrypted: true,
    });

    //if (!pusher) return;
    console.log("fetchChats2");

    try {
      const settings = await dispatch("settings/fetchSettings", null, {
        root: true,
      });

      // if (!settings.app_display_chat) {
      //   return;
      // }

      commit("CLOSE_CHATS");
      const response = await this.$axios.get("chat/list");
      commit("SET_CHATS", response.data);

      if (state.chat !== null) {
        const item = state.chats.find(
          (item) => item.chtNr === state.chat.chtNr
        );
        commit("SET_CHAT", item.chat);
      }
      return true;
    } catch (error) {
      console.error("There was an error fetching the chats!", error);
    }
  },
  async setChat({ dispatch, commit }, item) {
    if (!pusher) return;

    try {
      const chat = await this.$axios.post("chat/set", item);
      commit("SET_CHAT", chat.data);
      dispatch("getRelations", chat.data.chtNr);
    } catch (error) {
      console.error("There was an error saving the chat!", error);
    }
  },
  async getMessages({ dispatch, commit }, chtNr) {
    if (!pusher) return;

    try {
      const res = await this.$axios.get("chat/messages?chtNr=" + chtNr);
      commit("SET_MESSAGES", res.data);
    } catch (error) {
      console.error("There was an error saving the message!", error);
    }
  },
  async getRelations({ dispatch, commit }, chtNr) {
    if (!pusher) return;

    try {
      const res = await this.$axios.get("chat/relations?chtNr=" + chtNr);
      commit("SET_RELATIONS", res.data);
    } catch (error) {
      console.error("There was an error saving the message!", error);
    }
  },
  async setMessage({ dispatch }, item) {
    if (!pusher) return;

    try {
      await this.$axios.post("chat/message", item);
    } catch (error) {
      console.error("There was an error saving the message!", error);
    }
  },
  async invite({ dispatch }, item) {
    if (!pusher) return;

    try {
      await this.$axios.post("chat/invite", item);
      dispatch("fetchChats");
    } catch (error) {
      console.error("There was an error saving the invite!", error);
    }
  },
  async accept({ dispatch }, item) {
    if (!pusher) return;

    try {
      await this.$axios.post("chat/accept", item);
      dispatch("fetchChats");
    } catch (error) {
      console.error("There was an error saving the accept!", error);
    }
  },
  async set({ commit }, item) {
    if (!pusher) return;

    commit("SET_CHAT", item.chat);
    commit("SET_EDIT", item.edit);
  },
  async delete({ dispatch, state }) {
    if (!pusher) return;

    try {
      state.chat.chtActualYN = 0;
      await this.$axios.post("chat/set", state.chat);
      dispatch("fetchChats");
      dispatch("close");
    } catch (error) {
      console.error("There was an error saving the chat!", error);
    }
  },
  async close({ commit, state }) {
    if (!pusher) return;

    if (state.chat) {
      commit("CLOSE_CHAT");
    }
  },
  async clear({ commit, state }) {
    if (!pusher) return;

    Object.keys(state.channels).forEach((chtNr) => {
      commit("REMOVE_CHANNEL", chtNr);
    });
    commit("CLEAR_VALUE");
  },
  async edit({ dispatch, commit, state }, value) {
    if (!pusher) return;

    dispatch("getRelations", state.chat.chtNr);
    commit("SET_EDIT", value);
  },
  subscribeToChatChannel({ dispatch, commit, state }, chtNr) {
    if (!pusher) return;

    const channelName = `chat-${chtNr}`;
    const channel = pusher.subscribe(channelName);
    channel.bind("App\\Events\\TestEvent", (data) => {
      if (data.data.crmFltNr > 0) {
        dispatch("getMessages", data.data.crmChtNr);
      } else {
        commit("UPDATE_CHAT", data.data);
      }
    });
    commit("SET_CHANNEL", { chtNr, channel });
  },
  // New action to unsubscribe from a chat channel
  unsubscribeFromChatChannel({ commit, state }, chtNr) {
    if (!pusher) return;

    const channel = state.channels[chtNr];
    console.log("unsubscribeFromChatChannel");
    if (channel) {
      pusher.unsubscribe(`chat-${chtNr}`);
      commit("REMOVE_CHANNEL", chtNr);
    }
  },
};

const getters = {
  circles: (state) => state.chats,
  messageCount: (state) => state.messages.length,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
