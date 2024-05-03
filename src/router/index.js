import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/AddGoal',
    name: 'AddGoal',
    component: () => import('../views/CreateGoal.vue')
  },
  {
    path: '/AddTask',
    name: 'AddTask',
    component: () => import('../views/AddTask.vue')
  },
  {
    path: '/MyTasks',
    name: 'MyTasks',
    component: () => import('../views/MyTasks.vue')
  },
  {
    path: '/DoneTasks',
    name: 'DoneTasks',
    component: () => import('../views/DoneTasks.vue')
  },


]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
export default router
