import { createRouter, createWebHistory } from 'vue-router'
import { getAppConfig } from '../config'
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

// 获取应用配置
const config = getAppConfig()

const router = createRouter({
  history: createWebHistory(config.basePath),
  routes
})

export default router