import { createRouter, createWebHistory } from "vue-router";

import Manage from "@/views/Manage.vue";

const routes = [
  {
    name: "manage",
    path: "/manage",
    component: Manage,
  },
  {
    path: "/manage",
    redirect: { name: "manage" },
  },

  {
    path: "/:catchAll(.*)*",
    redirect: { name: "manage" },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkExactActiveClass: "text-yellow-500",
});

export default router;
