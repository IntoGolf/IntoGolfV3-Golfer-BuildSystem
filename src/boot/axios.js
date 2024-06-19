import { boot } from "quasar/wrappers";
import axios from "axios";
import store from "../store";
import router from "../router";
import { Loading, Notify, Platform } from "quasar";

const baseURL = process.env.VUE_APP_BASE_URL;

let loadingRequests = 0;
let hideLoadingTimeout = null;

axios.interceptors.request.use(
  (config) => {
    if (Platform.is.mobile) {
      axios.defaults.headers.common["X-App-Identifier"] = process.env.APP_ID;
    }

    config.url = `${baseURL}api/${config.url}`;
    const token = store.getters["currentUser/token"];
    if (token) {
      config.headers.common["Authorization"] = "Bearer " + token;
    }

    Loading.show();
    loadingRequests++;

    // Clear the hideLoadingTimeout when a new request is made
    clearTimeout(hideLoadingTimeout);

    return config;
  },
  (error) => {
    Loading.hide();
    loadingRequests = 0;
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    loadingRequests--;

    // Set a timeout to hide the loading indicator after 500 milliseconds
    hideLoadingTimeout = setTimeout(() => {
      if (loadingRequests <= 0) {
        Loading.hide();
        loadingRequests = 0;
      }
    }, 200);

    if (response.data && response.data.code >= 400) {
      this.$message.error(response.data.message);
      return Promise.reject(response);
    }
    return response.data;
  },
  function (error) {
    loadingRequests--;

    // Set a timeout to hide the loading indicator after 500 milliseconds
    hideLoadingTimeout = setTimeout(() => {
      if (loadingRequests <= 0) {
        Loading.hide();
        loadingRequests = 0;
      }
    }, 500);

    console.log("--- error response ---");
    console.log(error);
    let errorsObj = {};
    if (error.response.status >= 400) {
      let messages = [];
      errorsObj = error.response.data.errors || error.response.data.message;
      if (errorsObj.constructor === Object) {
        messages = Object.values(errorsObj).flat();
      } else {
        messages.push(errorsObj);
      }

      if (
        error.response &&
        (error.response.status === 419 || error.response.data.code === 404)
      ) {
        localStorage.clear();
        router.push("/login");
      }
      if (error.response.status === 400 || error.response.status === 422) {
        Notify.create({
          type: "negative",
          message: messages,
          html: messages.join("<br>"),
        });
      }
    }
    return Promise.reject(errorsObj);
  }
);

export default boot(({ app, store }) => {
  app.config.globalProperties.$http = axios;
  store.$axios = axios;
});
