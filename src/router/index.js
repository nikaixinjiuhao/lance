import Vue from 'vue'
import VueRouter from "vue-router";

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import ('../views/Home'),
      children:[
        {
          path: '/index',
          name: 'index',
          component: () => import ('../views/index'),
        },
        {
          path: '/purchase',
          name: 'purchase',
          component: () => import ('../views/Purchase'),
        },
        {
          path: '/move',
          name: 'move',
          component: () => import ('../views/Move'),
        },
        {
          path: '/sendMaterial',
          name: 'sendMaterial',
          component: () => import ('../views/SendMaterial'),
        },
        {
          path: '/print',
          name: 'print',
          component: () => import ('../views/Print'),
        },
        {
          path: '/bom',
          name: 'bom',
          component: () => import ('../views/BOM'),
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login'),
    }
  ]
})
export default router
