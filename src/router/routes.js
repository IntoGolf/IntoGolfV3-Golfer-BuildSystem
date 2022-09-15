const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../pages/Home.vue"),
    meta: {
      requiresAuth: true,
      title: "Home",
    },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../pages/Login.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/match",
    name: "Match",
    component: () => import("layouts/PageLayout.vue"),
    children: [{path: "", component: () => import("pages/Match.vue")}],
    meta: {
      requiresAuth: true,
      title: "Wedstrijden",
    },
  },
  {
    path: "/handicap",
    name: "Handicap",
    component: () => import("layouts/PageLayout.vue"),
    children: [{path: "", component: () => import("pages/Handicap.vue")}],
    meta: {
      requiresAuth: true,
      title: "Handicap",
    },
  },
  {
    path: "/checkin",
    name: "CheckIn",
    component: () => import("layouts/PageLayout.vue"),
    children: [{path: "", component: () => import("pages/CheckIn.vue")}],
    meta: {
      requiresAuth: true,
      title: "Starttijd inchecken",
    },
  },
  // {
  //   path: '/meerronden_list_mobile',
  //   name: 'MeerrondenListMobile',
  //   component: () => import('../pages/Meerronden_list_mobile.vue'),
  //   meta: {
  //     requiresAuth: true,
  //     title: 'Meerronden List',
  //   }
  // },
  {
    path: "/messages",
    name: "Berichten",
    component: () => import("layouts/PageLayout.vue"),
    children: [{path: "", component: () => import("pages/Messages.vue")}],
    meta: {
      requiresAuth: true,
      title: "Berichten",
    },
  },
  // {
  //   path: '/invoices_list_mobile',
  //   name: 'InvoiceListMobile',
  //   component: () => import('../pages/Invoices_list_mobile.vue'),
  //   meta: {
  //     requiresAuth: true,
  //     title: 'Facturen',
  //   }
  // },
  // {
  //   path: '/event_list_mobile',
  //   name: 'EvenementenListMobile',
  //   component: () => import('../pages/Event_list_mobile.vue'),
  //   meta: {
  //     requiresAuth: true,
  //     title: 'Evenementen',
  //   }
  // },
  // {
  //   path: '/calendar_mobile',
  //   name: 'CalendarMobile',
  //   component: () => import('../pages/Calendar_mobile.vue'),
  //   meta: {
  //     requiresAuth: true,
  //     title: 'Calendar',
  //   }
  // },
  // {
  //   path: '/query',
  //   name: 'query',
  //   component: () => import('../pages/Query.vue'),
  // },
  // {
  //   path: '/booking',
  //   name: 'booking',
  //   component: () => import('../pages/Booking.vue'),
  //   meta: {
  //     requiresAuth: false,
  //     title: 'Booking',
  //   }
  // },
  // {
  //   path: '/reservation',
  //   name: 'reservation',
  //   component: () => import('../pages/Reservation.vue'),
  //   meta: {
  //     requiresAuth: false,
  //     title: 'Reservation',
  //   }
  // },
  {
    path: "/reservations",
    name: "reservations",
    component: () => import("layouts/PageLayout.vue"),
    children: [{path: "", component: () => import("pages/Reservations.vue")}],
    meta: {
      requiresAuth: false,
      title: "Starttijden",
    },
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("layouts/PageLayout.vue"),
    children: [{path: "", component: () => import("pages/Profile.vue")}],
    meta: {
      requiresAuth: true,
      title: "Profiel",
    },
  },
  {
    path: "/ngf",
    name: "NGF",
    component: () => import("layouts/PageLayout.vue"),
    children: [{path: "", component: () => import("pages/NGF.vue")}],
    meta: {
      requiresAuth: true,
      title: "NGF kaart",
    },
  },
  // {
  //   path: '/course_status_mobile',
  //   name: 'Baanstatus',
  //   component: () => import('../pages/Course_status_mobile.vue'),
  //   meta: {
  //     requiresAuth: true,
  //     title: 'Baan status',
  //   },
  // },
  {
    path: "/members",
    name: "Ledenlijst",
    component: () => import("layouts/PageLayout.vue"),
    children: [{path: "", component: () => import("pages/Members.vue")}],
    meta: {
      requiresAuth: true,
      title: "Ledenlijst",
    },
  },
  // {
  //   path: '/order_list_mobile',
  //   name: 'Opdrachten',
  //   component: () => import('../pages/Order_list_mobile.vue'),
  //   meta: {
  //     requiresAuth: true,
  //     title: 'Opdrachten',
  //   },
  // },
  {
    path: "/sign-up",
    name: "signUp",
    component: () => import("../pages/SignUp.vue"),
    meta: {
      requiresAuth: false,
      title: "Sign Up",
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
    meta: { requiresAuth: false },
  },
  {
    path: "/reset/password",
    name: "resetPassword",
    component: () => import("../pages/ResetPassword"),
    meta: { requiresAuth: false },
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/404",
  },
];

export default routes;
