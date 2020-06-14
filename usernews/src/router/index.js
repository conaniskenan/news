import Vue from "vue"
import VueRouter from "vue-router"
import News from "../views/news"
import NewsDetail from "../components/newsDetail"
Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    redirect: "/news",
  },
  {
    path: "/news",
    component: News,
  },
  {
    path: "/news/:id",
    name: "NewsDetail",
    component: NewsDetail,
  },
]

const router = new VueRouter({
  mode: "history",
  routes,
})

export default router
