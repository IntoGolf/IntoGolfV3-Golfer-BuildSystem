import { boot } from "quasar/wrappers";
import axios from "axios";
import router from "../router";
import { Loading, Notify, Platform } from "quasar";
import { lsWatcher as ls } from "./app";

const baseURL = process.env.VUE_APP_BASE_URL;

axios.interceptors.request.use(
  (config) => {
    if (Platform.is.cordova) {
      axios.defaults.headers.common["X-App-Identifier"] = process.env.APP_ID;
    }
    Loading.show();
    config.url = `${baseURL}api/${config.url}`;
    let currentUser = ls.getItem("currentUser");
    console.log("a");
    console.log(currentUser);
    console.log("b");
    console.log(currentUser.value);
    console.log("c");
    console.log(currentUser.value.value);
    console.log("d");
    if (currentUser.value.relation_password !== undefined) {
      console.log("e");
      console.log(currentUser.value.value.relation_password.apiToken);
      config.headers.common["Authorization"] =
        "Bearer " + currentUser.value.value.relation_password.apiToken;
    }

    return config;
  },
  (error) => {
    Loading.hide();
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    console.log(`==axios response==`, response);
    Loading.hide();
    if (response.data && response.data.code >= 400) {
      this.$message.error(response.data.message);
      return Promise.reject(response);
    }
    return response.data;
  },
  function (error) {
    Loading.hide();
    console.log("--- error response ---");
    console.log(error.response);
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
        localStorage.removeItem("gofler__authorization");
        localStorage.removeItem("gofler__currentUser");
        localStorage.removeItem("gofler__scorecard");
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

export default boot(({ app }) => {
  app.config.globalProperties.$http = axios;
});
