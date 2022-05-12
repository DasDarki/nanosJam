import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import RestApi from "@/libs/rest-api";
import {User} from "@/types/dto";
import store from "@/store";

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    meta: {
      requiresAuth: true
    },
    component: () => import('@/views/DashboardView.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(async (to, from, next) => {
  // @ts-ignore
  if (!to.meta.requiresAuth) {
    next();
    return;
  }

  try {
    const user = (await RestApi.get<User>(`/user`)).data;
    if (user) {
      store.commit("setUser", user);
      next();
    } else {
      next({name: "home"});
    }
  } catch (e) {
    console.error(e);
    next({name: "home"});
  }
});

export default router
