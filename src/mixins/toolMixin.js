export default {
  methods: {
    getUrlParameter(name) {
      const fragment = window.location.hash;
      return new URLSearchParams(fragment.split("?")[1]).get(name);
    },
  },
};
