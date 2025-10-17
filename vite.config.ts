import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')

  // 设置 base path，优先使用环境变量，默认为开发环境的 '/'
  const base = env.VITE_BASE_PATH || '/'

  console.log(`🚀 Running in ${mode} mode, base path: ${base}`)

  return {
    plugins: [vue()],
    base,
    // 定义全局常量，可以在代码中通过 import.meta.env.BASE_URL 访问
    define: {
      __BASE_PATH__: JSON.stringify(base)
    }
  }
})
