import { Platform } from "quasar";
import app from "../App.vue";

import Home from "pages/Home.vue";
import HomeWeb from "pages/HomeWeb.vue";
import { createRouter, createWebHistory } from "vue-router";

let layoutComponent = app;

let homeComponent = Home;
if (Platform.is.desktop) {
  homeComponent = HomeWeb;
}

const routes = [
  {
    path: "/",
    name: "Home",
    component: homeComponent,
    meta: {
      requiresAuth: true,
      title: "",
    },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("pages/Login.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/teetimes",
    name: "teetimes",
    component: () => import("pages/Teetimes.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/external_teetimes",
    name: "external_teetimes",
    component: () => import("pages/ExtTeeTime.vue"),
    meta: {
      requiresAuth: true,
      title: "Starttijden",
    },
  },
  {
    path: "/external_course_status",
    name: "external_course_status",
    component: () => import("pages/ExtCourse.vue"),
    meta: {
      requiresAuth: true,
      title: "Baanstatus",
    },
  },
  {
    path: "/chat",
    name: "chat",
    component: () => import("pages/Chat.vue"),
    meta: {
      requiresAuth: true,
      title: "Chats",
    },
  },

  {
    path: "/public_lessons",
    name: "publicLesson",
    component: () => import("pages/PublicLessons.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/classes",
    name: "classes",
    component: () => import("pages/GolfClasses.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/startlist",
    name: "startlist",
    component: () => import("pages/Startlist.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/proCourse",
    name: "proCourse",
    component: () => import("pages/ProCourses.vue"),
    meta: {
      requiresAuth: true,
      title: "Cursussen",
    },
  },
  {
    path: "/nonGolfEvents",
    name: "nonGolfEvents",
    component: () => import("pages/NonGolfEvents.vue"),
    meta: {
      requiresAuth: true,
      title: "Activiteiten",
    },
  },
  {
    path: "/match",
    name: "Match",
    component: () => import("pages/Match.vue"),
    meta: {
      requiresAuth: true,
      title: "Wedstrijden",
    },
  },
  {
    path: "/Baanstatus",
    name: "Baanstatus",
    component: () => import("pages/Course.vue"),
    meta: {
      requiresAuth: true,
      title: "Baanstatus",
    },
  },
  {
    path: "/Meerronden",
    name: "Meerronden",
    component: () => import("pages/Meerronden.vue"),
    meta: {
      requiresAuth: true,
      title: "Meerronden",
    },
  },
  {
    path: "/handicap",
    name: "Handicap",
    component: () => import("pages/Handicap.vue"),
    meta: {
      requiresAuth: true,
      title: "Handicap",
    },
  },
  {
    path: "/checkin",
    name: "CheckIn",
    component: () => import("pages/CheckIn.vue"),
    meta: {
      requiresAuth: true,
      title: "Starttijd inchecken",
    },
  },
  {
    path: "/messages",
    name: "Berichten",
    component: () => import("pages/Messages.vue"),
    meta: {
      requiresAuth: true,
      title: "Berichten",
    },
  },
  {
    path: "/pos",
    name: "Horeca",
    component: () => import("pages/Pos.vue"),
    meta: {
      requiresAuth: true,
      title: "Horeca",
    },
  },
  {
    path: "/lessons",
    name: "Lessen",
    component: () => import("pages/Lessons.vue"),
    meta: {
      requiresAuth: true,
      title: "Lessen",
    },
  },
  {
    path: "/lessoncards",
    name: "lessoncards",
    component: () => import("pages/Lessoncards.vue"),
    meta: {
      requiresAuth: true,
      title: "Leskaarten",
    },
  },
  {
    path: "/greenfeecards",
    name: "greenfeecards",
    component: () => import("pages/Greenfeecards.vue"),
    meta: {
      requiresAuth: true,
      title: "Rondekaarten",
    },
  },
  {
    path: "/shop",
    name: "Shop",
    component: () => import("pages/Shop.vue"),
    meta: {
      requiresAuth: true,
      title: "Shop",
    },
  },
  {
    path: "/reservations",
    name: "reservations",
    component: () => import("pages/Reservations.vue"),
    meta: {
      requiresAuth: false,
      title: "Starttijden",
    },
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("pages/Profile.vue"),
    meta: {
      requiresAuth: true,
      title: "Profiel",
    },
  },
  {
    path: "/ngf",
    name: "NGF",
    component: () => import("pages/NGF.vue"),
    meta: {
      requiresAuth: true,
      title: "NGF kaart",
    },
  },
  {
    path: "/members",
    name: "Ledenlijst",
    component: () => import("pages/Members.vue"),
    meta: {
      requiresAuth: true,
      title: "Ledenlijst",
    },
  },
  {
    path: "/Baankalender",
    name: "Baankalender",
    component: () => import("pages/Calendar.vue"),
    meta: {
      requiresAuth: true,
      title: "Baankalender",
    },
  },
  {
    path: "/sign-up",
    name: "signUp",
    component: () => import("pages/SignUp.vue"),
    meta: {
      requiresAuth: false,
      title: "Inschrijven",
    },
  },
  {
    path: "/404",
    name: "404",
    component: () => import("../pages/404"),
  },
  {
    path: "/verify-code",
    name: "verifyCode",
    component: () => import("../pages/SendVerifyCode"),
    meta: {
      requiresAuth: false,
      title: "Verificatie code",
    },
  },
  {
    path: "/reset/password",
    name: "resetPassword",
    component: () => import("../pages/ResetPassword"),
    meta: {
      requiresAuth: false,
      title: "Wachtwoord aanpassen",
    },
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/404",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export { router, routes };
