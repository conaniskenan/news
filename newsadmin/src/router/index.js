import Vue from "vue"
import VueRouter from "vue-router"
import Index from "../components/index"
import Home from "../components/home"
import Users from "../components/user/users"
import News from "../components/news/news"
import Comment from '../components/comment/comment'

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    redirect: "/index",
  },
  {
    path: "/index",
    component: Index,
  },
  {
    path: "/home",
    component: Home,
    redirect: "/news",
    children: [
      {
        path: "/users",
        component: Users,
      },
      {
        path: "/news",
        component: News,
      },
      {
        path: "/comment",
        component: Comment,
      },
    ],
  },
]

const router = new VueRouter({
  mode: "history",
  routes,
})
router.beforeEach((to, from, next) => {
  if (to.path === "/index") return next()
  if (!localStorage.getItem("token")) next("/index")
  next()
})
export default router
