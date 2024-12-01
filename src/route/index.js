import { createMemoryHistory, createRouter } from "vue-router";

import HomePage from "./../pages/index.vue";
import LoginPage from "./../pages/login.vue";

export const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    {
      name: "Home",
      path: "/",
      component: HomePage,
    },
    {
      name: "Login",
      path: "/login",
      component: LoginPage,
    },
  ],
});

