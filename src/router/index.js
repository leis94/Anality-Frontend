import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import NotFount from '../views/NotFount'
import Logout from '../views/Logout'
import Home from '../views/Home'
import Multas from '../components/Multas/ListMultas'
import Ocupacion from '../components/Ocupacion/ListOcupacion'
import HrsLabor from '../components/HrsLabor/ListHrsLabor'
import Volumetrias from '../components/Volumetrias/ListVolumetrias'
import Ans from '../components/Ans/ListAns'

Vue.use(VueRouter)

const routes = [
  {
    path: '/app/logout',
    name: 'Logout',
    component: Logout,
  },
  {
    path: '/app/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/app/multas',
    name: 'Multas',
    component: Multas,
    meta: {
      requiredPermission: true,
    }
  },
  {
    path: '/app/ocupacion',
    name: 'Ocupacion',
    component: Ocupacion,
    meta: {
      requiredPermission: true,
    }
  },
  {
    path: '/app/horas_labor',
    name: 'HrsLabor',
    component: HrsLabor,
    meta: {
      requiredPermission: true,
    }
  },
  {
    path: '/app/volumetrias',
    name: 'Volumetrias',
    component: Volumetrias,
    meta: {
      requiredPermission: true,
    }
  },
  {
    path: '/app/ans',
    name: 'Ans',
    component: Ans,
    meta: {
      requiredPermission: true,
    }
  },
  {
    path: '/app/404',
    name: '404',
    component: NotFount
  },
  {
    path: '/app/*',
    redirect: '/app/404'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  linkActiveClass: 'is.active',
  routes
})

function goToRoute(to){
  let formularios = localStorage.getItem('formularios')
  if(typeof(formularios) === "string"){
    formularios = formularios.split(",")
  }
  if (formularios.findIndex(el => el === to) != -1 || formularios.findIndex(el => el === "TODOS") != -1){
    store.dispatch("loadDataAll")
    return true
  }else{
    return false
  }
}

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiredPermission)){
    if (goToRoute(to.name)){
      next()
    }else{
      next({'name':'Home'})
    }
    
  }else{
    next()
  }
})

export default router
