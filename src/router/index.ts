import { createRouter, createWebHistory } from 'vue-router'
import BlogHome from '../components/BlogHome.vue'
import BlogDetail from '../components/BlogDetail.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: BlogHome
  },
  {
    path: '/blog/:slug',
    name: 'BlogDetail',
    component: BlogDetail,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory('/NovaBlog/'),
  routes
})

export default router