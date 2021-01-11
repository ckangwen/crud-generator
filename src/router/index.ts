import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import CrudGenerator from "../views/CrudGenerator";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "CrudGenerator",
    component: CrudGenerator
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
