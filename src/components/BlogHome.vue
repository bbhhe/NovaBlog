<template>
  <div class="blog-home">
    <!-- Header 导航区 -->
    <header class="header">
      <div class="container">
        <div class="header-content">
          <div class="logo-section">
            <h1 class="logo">BLOG</h1>
            <div class="subtitle">
              <p class="subtitle-en">Latest articles about Claude Code and AI development</p>
              <p class="subtitle-zh">关于 Claude Code 和人工智能发展的最新文章</p>
            </div>
          </div>
          <nav class="nav">
            <button class="nav-btn home-btn">
              <span>Home</span>
              <span class="nav-btn-zh">首页</span>
            </button>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              class="nav-btn github-btn"
            >
              <svg class="github-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span>GitHub</span>
            </a>
          </nav>
        </div>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="main-content">
      <div class="container">
        <section class="blog-section">
          <h2 class="blog-title">
            Blog (articles/tutorials/guides)
            <span class="blog-title-zh">博客（文章/教程/指南）</span>
          </h2>

          <!-- 加载状态 -->
          <div v-if="loading" class="loading-state">
            <div class="loading-spinner"></div>
            <p>正在加载博客文章...</p>
          </div>

          <!-- 错误状态 -->
          <div v-else-if="error" class="error-state">
            <p>加载失败: {{ error }}</p>
            <button @click="fetchPosts" class="retry-btn">重试</button>
          </div>

          <!-- 无文章状态 -->
          <div v-else-if="!hasPosts" class="empty-state">
            <p>暂无博客文章</p>
          </div>

          <!-- 文章列表 -->
          <div v-else class="blog-grid">
            <BlogCard
              v-for="article in posts"
              :key="article.slug"
              :article="article"
              @click="handleArticleClick"
            />
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BlogCard from './BlogCard.vue'
import { useBlogPosts } from '../composables/useBlog'
import type { BlogPostListItem } from '../types/blog'

const router = useRouter()
const { posts, loading, error, hasPosts, fetchPosts } = useBlogPosts()

const handleArticleClick = (article: BlogPostListItem) => {
  router.push(`/blog/${article.slug}`)
}

onMounted(() => {
  fetchPosts()
})
</script>

<style scoped>
.blog-home {
  min-height: 100vh;
  background-color: #1e1e1e;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Header 样式 */
.header {
  padding: 40px 0;
  border-bottom: 1px solid #333;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
}

.logo-section {
  flex: 1;
}

.logo {
  font-family: 'Courier New', monospace;
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 10px 0;
  letter-spacing: 3px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.subtitle {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.subtitle-en,
.subtitle-zh {
  margin: 0;
  font-size: 0.9rem;
  color: #b0b0b0;
  line-height: 1.4;
}

.nav {
  display: flex;
  gap: 15px;
  align-items: center;
}

.nav-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 16px;
  background-color: #2b2b2b;
  border: 1px solid #444;
  border-radius: 6px;
  color: #e0e0e0;
  text-decoration: none;
  font-size: 0.85rem;
  transition: all 0.25s ease;
  cursor: pointer;
}

.nav-btn:hover {
  background-color: #3b3b3b;
  border-color: #4a9eff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74, 158, 255, 0.2);
}

.nav-btn-zh {
  font-size: 0.7rem;
  color: #b0b0b0;
}

.github-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-direction: row !important;
}

.github-icon {
  width: 18px;
  height: 18px;
  fill: #e0e0e0;
}

/* 主内容区样式 */
.main-content {
  padding: 60px 0;
}

.blog-section {
  text-align: center;
}

.blog-title {
  font-size: 2rem;
  color: #ffffff;
  margin-bottom: 50px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.blog-title-zh {
  font-size: 1.2rem;
  font-weight: 400;
  color: #b0b0b0;
}

/* 状态样式 */
.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 3rem 0;
  color: #b0b0b0;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #333;
  border-top: 3px solid #4a9eff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.retry-btn {
  margin-top: 1rem;
  padding: 8px 16px;
  background-color: #4a9eff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.25s ease;
}

.retry-btn:hover {
  background-color: #3a8eef;
}

.blog-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
  text-align: left;
}


/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }

  .logo {
    font-size: 2rem;
  }

  .nav {
    justify-content: center;
  }

  .blog-title {
    font-size: 1.6rem;
  }

  
  .container {
    padding: 0 15px;
  }

  .header {
    padding: 30px 0;
  }

  .main-content {
    padding: 40px 0;
  }
}

@media (max-width: 480px) {
  .nav-btn {
    padding: 6px 12px;
    font-size: 0.8rem;
  }

  .github-btn span:not(.github-icon) {
    display: none;
  }

  .blog-title {
    font-size: 1.4rem;
  }
}
</style>