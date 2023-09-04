import { route } from "quasar/wrappers";
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from "vue-router";
import routes from "./routes";
import { lsWatcher as ls } from "../boot/app";
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

  Router.beforeEach((to, from, next) => {
    const user = ls.getItem("currentUser", null).value;
    console.log("user");
    console.log(user);
    console.log(user.value.relation_password);
    console.log("user done");
    if (to.matched.some((r) => r.meta.requiresAuth)) {
      if (user && user.relation_password && user.relation_password.apiToken) {
        if (to.path === "/login") {
          next({ path: "/" });
        }
      } else {
        next(to.path !== "/login" ? { path: "/login" } : true);
      }
    } else {
      if (user && user.relation_password && user.relation_password.apiToken) {
        if (to.path === "/login") {
          next({ path: "/" });
        }
      }
    }
    next();
  });

  return Router;
});
