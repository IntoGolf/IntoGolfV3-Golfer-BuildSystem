const mixin = {
  methods: {
    isLogin() {
      return this.$ls.getItem("currentUser");
    },
  },
};

export default mixin;
