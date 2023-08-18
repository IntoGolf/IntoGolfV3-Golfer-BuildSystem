const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("layouts/PageLayout.vue"),
    children: [{ path: "", component: () => import("pages/Home.vue") }],
    meta: {
      requiresAuth: true,
      title: "Home",
    },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("layouts/BlankLayout.vue"),
    children: [{ path: "", component: () => import("pages/Login.vue") }],
    meta: { requiresAuth: false },
  },
  {
    path: "/teetimes",
    name: "teetimes",
    component: () => import("layouts/BlankLayout.vue"),
    children: [{ path: "", component: () => import("pages/Teetimes.vue") }],
    meta: { requiresAuth: false },
  },
  {
    path: "/classes",
    name: "classes",
    component: () => import("layouts/BlankLayout.vue"),
    children: [{ path: "", component: () => import("pages/GolfClasses.vue") }],
    meta: { requiresAuth: false },
  },
  {
    path: "/startlist",
    name: "startlist",
    component: () => import("layouts/BlankLayout.vue"),
    children: [{ path: "", component: () => import("pages/Startlist.vue") }],
    meta: { requiresAuth: false },
  },
  {
    path: "/proCourse",
    name: "proCourse",
    component: () => import("layouts/PageLayout.vue"),
    children: [{ path: "", component: () => import("pages/ProCourses.vue") }],
    meta: {
      requiresAuth: true,
      title: "Cursussen",
    },
  },
  {
    path: "/match",
    name: "Match",
    component: () => import("layouts/PageLayout.vue"),
    children: [{ path: "", component: () => import("pages/Match.vue") }],
    meta: {
      requiresAuth: true,
      title: "Wedstrijden",
    },
  },
  {
    path: "/course",
    name: "Course",
    component: () => import("layouts/PageLayout.vue"),
    children: [{ path: "", component: () => import("pages/Course.vue") }],
    meta: {
      requiresAuth: true,
      title: "Baan",
    },
  },
  {
    path: "/handicap",
    name: "Handicap",
    component: () => import("layouts/PageLayout.vue"),
    children: [{ path: "", component: () => import("pages/Handicap.vue") }],
    meta: {
      requiresAuth: true,
      title: "Handicap",
    },
  },
  {
    path: "/checkin",
    name: "CheckIn",
    component: () => import("layouts/PageLayout.vue"),
    children: [{ path: "", component: () => import("pages/CheckIn.vue") }],
    meta: {
      requiresAuth: true,
      title: "Starttijd inchecken",
    },
  },
  {
    path: "/messages",
    name: "Berichten",
    component: () => import("layouts/PageLayout.vue"),
    children: [{ path: "", component: () => import("pages/Messages.vue") }],
    meta: {
      requiresAuth: true,
      title: "Berichten",
    },
  },
  {
    path: "/pos",
    name: "Horeca",
    component: () => import("layouts/PageLayout.vue"),
    children: [{ path: "", component: () => import("pages/Pos.vue") }],
    meta: {
      requiresAuth: true,
      title: "Horeca",
    },
  },
  {
    path: "/lessons",
    name: "Lessen",
    component: () => import("layouts/PageLayout.vue"),
    children: [{ path: "", component: () => import("pages/Lessons.vue") }],
    meta: {
      requiresAuth: true,
      title: "Lessen",
    },
  },
  {
    path: "/shop",
    name: "Shop",
    component: () => import("layouts/PageLayout.vue"),
    children: [{ path: "", component: () => import("pages/Shop.vue") }],
    meta: {
      requiresAuth: true,
      title: "Shop",
    },
  },
  {
    path: "/reservations",
    name: "reservations",
    component: () => import("layouts/PageLayout.vue"),
    children: [{ path: "", component: () => import("pages/Reservations.vue") }],
    meta: {
      requiresAuth: false,
      title: "Starttijden",
    },
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("layouts/PageLayout.vue"),
    children: [{ path: "", component: () => import("pages/Profile.vue") }],
    meta: {
      requiresAuth: true,
      title: "Profiel",
    },
  },
  {
    path: "/ngf",
    name: "NGF",
    component: () => import("layouts/PageLayout.vue"),
    children: [{ path: "", component: () => import("pages/NGF.vue") }],
    meta: {
      requiresAuth: true,
      title: "NGF kaart",
    },
  },
  {
    path: "/members",
    name: "Ledenlijst",
    component: () => import("layouts/PageLayout.vue"),
    children: [{ path: "", component: () => import("pages/Members.vue") }],
    meta: {
      requiresAuth: true,
      title: "Ledenlijst",
    },
  },
  {
    path: "/sign-up",
    name: "signUp",
    component: () => import("layouts/BlankLayout.vue"),
    children: [{ path: "", component: () => import("pages/SignUp.vue") }],
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

export default routes;
