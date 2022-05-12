import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import RestApi from "@/libs/rest-api";
import {User} from "@/types/dto";
import store from "@/store";
import Cookies from "js-cookie";
import {AccessTokenKey} from "@/libs/consts";

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
  },
  {
    path: '/admin',
    name: 'admin',
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    },
    component: () => import('@/views/AdminView.vue')
  },
  {
    path: '/login',
    name: 'login',
    beforeEnter: () => {
      window.location.href = process.env.VUE_APP_API_URL + "/auth";
    }
  },
  {
    path: '/login-success',
    name: 'login-success',
    beforeEnter: (to, from, next) => {
      const atk = to.query["atk"]?.toString();

      if (atk) {
        Cookies.set(AccessTokenKey, atk);
        next({name: "dashboard"});
      } else {
        next({name: "home"});
      }
    }
  },
  {
    path: '/logout',
    name: 'logout',
    beforeEnter: (to, from, next) => {
      Cookies.remove(AccessTokenKey);
      next({name: "home"});
    }
  },
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

      // @ts-ignore
      if (to.meta.requiresAdmin && !user.isAdmin) {
        next({name: "home"});
      } else {
        next();
      }
    } else {
      next({name: "home"});
    }
  } catch (e) {
    console.error(e);
    next({name: "home"});
  }
});

export default router
