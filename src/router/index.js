import Vue from 'vue'
import Router from 'vue-router'
import Login from "../components/login/login.vue"
import Home from "../components/Home.vue"


Vue.use(Router)

const router= new Router({
  routes: [
    {
      path:"/",redirect:"/login"
    },
    {
      path:"/home",
      component:Home
    },
    {
      path: '/login',
      name:"login",
      component:Login
    
    }
  ]
})
router.beforeEach((to,from ,next)=>{
  if(to.path==="/login") return next();
 const tokenStr= window.sessionStorage.getItem("token")
 if(!tokenStr) return next("/login")
 next()
})

export default router