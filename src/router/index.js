import {route} from "quasar/wrappers";
import {createMemoryHistory, createRouter, createWebHashHistory, createWebHistory,} from "vue-router";
import {routes} from "./routes";
import store from "src/store";
/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */
/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(
      process.env.MODE === "ssr" ? void 0 : process.env.VUE_ROUTER_BASE
    ),
  });

  Router.beforeEach(async (to, from, next) => {
    const token = store.getters["currentUser/token"];

    // Ensure the store is initialized before proceeding
    if (token && store.getters["settings/isItemEmpty"]) {
      await store.dispatch("initializeApp");
    }

    if (!token && store.getters["settings/isPublicEmpty"]) {
      await store.dispatch("initializePublicApp");
    }

    if (to.matched.some((r) => r.meta.requiresAuth)) {
      if (token) {
        if (to.path === "/login") {
          return next({ path: "/" });
        }
      } else {
        return next(to.path !== "/login" ? { path: "/login" } : true);
      }
    } else {
      if (token) {
        if (to.path === "/login" && !to.query.redirect) {
          return next({ path: "/" });
        }
      }
    }

    next();
  });

  // Handle incoming links
  document.addEventListener(
    "deviceready",
    () => {
      universalLinks.subscribe(null, (eventData) => {
        const url = new URL(eventData.url);
        // Extract the path from the URL
        let path = url.hash.substring(1);
        Router.push({ path: path });
      });
    },
    false
  );

  return Router;
});
