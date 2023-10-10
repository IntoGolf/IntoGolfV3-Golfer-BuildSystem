const mixin = {
  computed: {
    settings() {
      let settings = JSON.parse(localStorage.getItem("golfer__settings"));
      return settings ? settings : false;
    },
    currentUser() {
      let currentUser = JSON.parse(localStorage.getItem("golfer__currentUser"));
      return currentUser ? currentUser : false;
    },
    Authorization() {
      let authorization = JSON.parse(
        localStorage.getItem("golfer__Authorization")
      );
      return authorization ? authorization : false;
    },
    currentUserPref() {
      let currentUserPref = JSON.parse(
        localStorage.getItem("golfer__currentUserPref")
      );
      return currentUserPref ? currentUserPref : false;
    },
  },
};

export default mixin;
