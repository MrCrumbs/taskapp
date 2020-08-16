import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Tasks from '../views/Tasks.vue'
import TaskDetails from '../views/TaskDetails.vue'
import Locations from '../views/Locations.vue'
import Students from '../views/Students.vue'
import Settings from '../views/Settings.vue'
import RecycleBin from "../views/RecycleBin";

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'tasks',
    component: Tasks,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/tasks',
    name: 'tasks',
    component: Tasks,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/task/:id',
    name: 'task',
    component: TaskDetails,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/locations',
    name: 'Locations',
    component: Locations,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/students',
    name: 'Students',
    component: Students,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: {
      requiresAuth: true
    }
  },
  {
      path: '/recycleBin',
      name: 'RecycleBin',
      component: RecycleBin,
      meta: {
        requiresAuth: true
      }
    },
  {
    path: '/login',
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
