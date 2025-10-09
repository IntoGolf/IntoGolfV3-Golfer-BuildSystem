import {Platform} from "quasar";
import app from "../App.vue";
import Home from "pages/Home.vue";
import HomeWeb from "pages/HomeWeb.vue";
import {createRouter, createWebHistory} from "vue-router";

let layoutComponent = app;

let homeComponent = Home;
if (Platform.is.desktop) {
  homeComponent = HomeWeb;
}

const routes = [
  {
    path: "/",
    name: "home",
    component: homeComponent,
    meta: {
      requiresAuth: true,
      title: "Home",
    },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("pages/Login.vue"),
    meta: {requiresAuth: false},
  },
  {
    path: "/teetimes",
    name: "teetimes",
    component: () => import("pages/Teetimes.vue"),
    meta: {requiresAuth: false},
  },
  {
    path: "/teetimes-new",
    name: "teetimes-new",
    component: () => import("pages/TeetimesNew.vue"),
    meta: {requiresAuth: false, title: "Starttijden (Nieuwe UX)"},
  },
  {
    path: "/home-modern",
    name: "home-modern",
    component: () => import("pages/HomeModern.vue"),
    meta: {requiresAuth: true, title: "Modern Dashboard"},
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
    path: "/whs",
    name: "whs",
    component: () => import("pages/WHS.vue"),
    meta: {
      requiresAuth: true,
      title: "WHS",
    },
  },
  {
    path: "/reload",
    name: "reload",
    component: () => import("pages/reload.vue"),
    meta: {
      requiresAuth: true,
      title: "reload",
    },
  },
  {
    path: "/history",
    name: "history",
    component: () => import("pages/StartTimeHistory.vue"),
    meta: {requiresAuth: false, title: "Speelhistorie"},
  },
  {
    path: "/invoice",
    name: "invoice",
    component: () => import("../components/invoice/index.vue"),
    meta: {requiresAuth: false, title: "Facturen"},
  },
  {
    path: "/publicLesson",
    name: "publicLesson",
    component: () => import("pages/PublicLessons.vue"),
    meta: {requiresAuth: false, title: "Boek een les"},
  },
  {
    path: "/publicWalkins",
    name: "publicWalkins",
    component: () => import("pages/PublicWalkins.vue"),
    meta: {requiresAuth: false, title: "Boek een inlooples"},
  },
  {
    path: "/publicStatus",
    name: "publicStatus",
    component: () => import("pages/PublicStatus.vue"),
    meta: {requiresAuth: false, title: "Baanstatus"},
  },
  {
    path: "/classes",
    name: "classes",
    component: () => import("pages/PublicClasses.vue"),
    meta: {requiresAuth: false, title: "Boek een cursus"},
  },
  {
    path: "/startlist",
    name: "startlist",
    component: () => import("pages/Startlist.vue"),
    meta: {requiresAuth: false},
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
    name: "match",
    component: () => import("pages/Match.vue"),
    meta: {
      requiresAuth: true,
      title: "Wedstrijden",
    },
  },
  {
    path: "/baanstatus",
    name: "baanstatus",
    component: () => import("pages/Course.vue"),
    meta: {
      requiresAuth: true,
      title: "Baanstatus",
    },
  },
  {
    path: "/meerronden",
    name: "meerronden",
    component: () => import("pages/Meerronden.vue"),
    meta: {
      requiresAuth: true,
      title: "Meerronden",
    },
  },
  {
    path: "/handicap",
    name: "handicap",
    component: () => import("pages/Handicap.vue"),
    meta: {
      requiresAuth: true,
      title: "Handicap",
    },
  },
  {
    path: "/checkin",
    name: "checkin",
    component: () => import("pages/CheckIn.vue"),
    meta: {
      requiresAuth: true,
      title: "Starttijd inchecken",
    },
  },
  {
    path: "/messages",
    name: "messages",
    component: () => import("pages/Messages.vue"),
    meta: {
      requiresAuth: true,
      title: "Berichten",
    },
  },
  {
    path: "/chat",
    name: "chat",
    component: () => import("pages/Chat.vue"),
    meta: {
      requiresAuth: true,
      title: "Chat",
    },
  },
  {
    path: "/pos",
    name: "pos",
    component: () => import("pages/Pos.vue"),
    meta: {
      requiresAuth: true,
      title: "Horeca",
    },
  },
  {
    path: "/lessons/:lesNr?",
    name: "lessons",
    component: () => import("pages/Lessons.vue"),
    meta: {
      requiresAuth: true,
      title: "Lessen",
    },
  },
  {
    path: "/walkins",
    name: "walkins",
    component: () => import("../components/lessons/walkins.vue"),
    meta: {
      requiresAuth: true,
      title: "Inlooplessen",
    },
  },
  {
    path: "/relation_classes",
    name: "relation_classes",
    component: () => import("../components/lessons/classes.vue"),
    meta: {
      requiresAuth: true,
      title: "Cursussen",
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
    name: "shop",
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
    name: "ngf",
    component: () => import("pages/NGF.vue"),
    meta: {
      requiresAuth: true,
      title: "NGF kaart",
    },
  },
  {
    path: "/members",
    name: "members",
    component: () => import("pages/Members.vue"),
    meta: {
      requiresAuth: true,
      title: 'Ledenboekje',
    },
  },
  {
    path: "/friends",
    name: "friends",
    component: () => import("pages/Friends.vue"),
    meta: {
      requiresAuth: true,
      title: "Vrienden",
    },
  },
  {
    path: "/friends/search",
    name: "friends-search",
    component: () => import("pages/FriendsSearch.vue"),
    meta: {
      requiresAuth: true,
      title: "Vrienden Zoeken",
    },
  },
  {
    path: "/open-bookings",
    name: "open-bookings",
    component: () => import("pages/OpenBookings.vue"),
    meta: {
      requiresAuth: true,
      title: "Open Bookings",
    },
  },
  {
    path: "/friends/:relNr",
    name: "friend-detail",
    component: () => import("pages/FriendDetail.vue"),
    meta: {
      requiresAuth: true,
      title: "Vriend Details",
    },
  },
  {
    path: "/baankalender",
    name: "baankalender",
    component: () => import("pages/Calendar.vue"),
    meta: {
      requiresAuth: true,
      title: "Baankalender",
    },
  },
  {
    path: "/signUp",
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
    path: "/verifyCode",
    name: "verifyCode",
    component: () => import("../pages/SendVerifyCode"),
    meta: {
      requiresAuth: false,
      title: "Verificatie code",
    },
  },
  {
    path: "/reset/password",
    name: "password",
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
  linkActiveClass: 'active',
  history: createWebHistory(),
  routes,
});

export {router, routes};
