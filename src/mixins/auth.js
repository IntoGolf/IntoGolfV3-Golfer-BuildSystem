const mixin = {
  computed: {
    settings() {
      return this.$ls.getItem("settings").value;
    },
    currentUser() {
      return this.$ls.getItem("currentUser").value;
    },
    Authorization() {
      return this.$ls.getItem("Authorization").value;
    },
    currentUserPref() {
      return this.$ls.getItem("currentUserPref").value;
    },
  },
};

export default mixin;
