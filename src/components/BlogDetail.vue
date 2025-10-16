<template>
  <div class="blog-detail">
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
            <button class="nav-btn home-btn" @click="goHome">
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

    <!-- 加载状态 -->
    <main class="main-content" v-if="loading">
      <div class="container">
        <div class="loading-state">
          <div class="loading-spinner"></div>
          <p>正在加载文章...</p>
        </div>
      </div>
    </main>

    <!-- 错误状态 -->
    <main class="main-content" v-else-if="error">
      <div class="container">
        <div class="error-state">
          <h1>加载失败</h1>
          <p>{{ error }}</p>
          <div class="error-actions">
            <button @click="() => fetchPost()" class="retry-btn">重试</button>
            <button @click="goHome" class="back-btn">返回首页</button>
          </div>
        </div>
      </div>
    </main>

    <!-- 404 页面 -->
    <main class="main-content" v-else-if="!hasPost">
      <div class="container">
        <div class="not-found">
          <h1>404 - Article Not Found</h1>
          <p>文章未找到</p>
          <button class="back-btn" @click="goHome">返回首页</button>
        </div>
      </div>
    </main>

    <!-- 博客内容区 -->
    <main class="main-content" v-else-if="post">
      <div class="container">
        <!-- 文章标题区 -->
        <div class="article-header">
          <h1 class="article-title">
            {{ post.title }}
          </h1>

          <!-- Copy as Markdown 按钮 -->
          <button
            class="copy-btn"
            @click="copyAsMarkdown"
            :class="{ copied: copySuccess }"
          >
            <span v-if="!copySuccess">Copy as Markdown</span>
            <span v-else>Copied!</span>
          </button>
        </div>

        <!-- 摘要 / 导语段落 -->
        <div class="article-excerpt">
          <p>{{ post.summary }}</p>
        </div>

        <!-- 元信息区 -->
        <div class="article-meta">
          <span class="meta-date">{{ formatDate(post.date) }}</span>
          <span class="meta-separator">|</span>
          <span class="meta-read-time">{{ post.readingTime || 'Unknown' }}</span>
          <span class="meta-separator">|</span>
          <div class="meta-tags">
            <span
              v-for="tag in post.tags"
              :key="tag"
              class="tag"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <!-- 封面图片 -->
        <div class="article-cover" v-if="post.cover">
          <img :src="post.cover" :alt="post.title" class="cover-image" />
        </div>

        <!-- 正文内容 -->
        <article class="article-content">
          <div v-html="renderedContent"></div>
        </article>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBlogPost } from '../composables/useBlog'

const props = defineProps<{
  slug: string
}>()

const router = useRouter()
const copySuccess = ref(false)
const { post, loading, error, hasPost, fetchPost } = useBlogPost(props.slug)

// 渲染 HTML 内容（从数据中直接获取）
const renderedContent = computed(() => {
  return post.value?.html || ''
})

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 复制为 Markdown
const copyAsMarkdown = async () => {
  if (!post.value) return

  const markdownContent = `# ${post.value.title}

**Date:** ${formatDate(post.value.date)}
**Read Time:** ${post.value.readingTime || 'Unknown'}
**Tags:** ${post.value.tags.join(', ')}

---

## Summary

${post.value.summary}

---

## Content

${post.value.content}`

  try {
    await navigator.clipboard.writeText(markdownContent)
    copySuccess.value = true
    setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

// 返回首页
const goHome = () => {
  router.push('/')
}

// 加载文章
onMounted(() => {
  fetchPost()
})
</script>

<style scoped>
.blog-detail {
  min-height: 100vh;
  background-color: var(--color-dark-bg);
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Header 样式 */
.header {
  padding: 40px 0;
  border-bottom: 1px solid var(--color-dark-border);
  position: sticky;
  top: 0;
  background-color: var(--color-dark-bg);
  z-index: 100;
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
  color: var(--color-text-primary);
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
  color: var(--color-text-muted);
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
  background-color: var(--color-dark-surface);
  border: 1px solid var(--color-dark-border);
  border-radius: 6px;
  color: var(--color-text-primary);
  text-decoration: none;
  font-size: 0.85rem;
  transition: all 0.25s ease;
  cursor: pointer;
}

.nav-btn:hover {
  background-color: #3b3b3b;
  border-color: var(--color-accent);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(247, 158, 27, 0.2);
}

.nav-btn-zh {
  font-size: 0.7rem;
  color: var(--color-text-muted);
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
  fill: var(--color-text-primary);
}

/* 主内容区样式 */
.main-content {
  padding: 60px 0;
}

/* 状态样式 */
.loading-state,
.error-state,
.not-found {
  text-align: center;
  padding: 4rem 0;
  color: var(--color-text-secondary);
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid #333;
  border-top: 3px solid var(--color-accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 2rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.retry-btn {
  padding: 12px 24px;
  background-color: var(--color-accent);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.25s ease;
}

.retry-btn:hover {
  background-color: var(--color-accent-hover);
  transform: translateY(-2px);
}

/* 文章标题区 */
.article-header {
  text-align: center;
  margin-bottom: 40px;
  position: relative;
}

.article-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.3;
  margin-bottom: 20px;
}

.copy-btn {
  position: absolute;
  top: 0;
  right: 0;
  padding: 8px 16px;
  background-color: var(--color-dark-surface);
  border: 1px solid var(--color-dark-border);
  border-radius: 6px;
  color: var(--color-text-primary);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.25s ease;
}

.copy-btn:hover {
  background-color: var(--color-accent);
  border-color: var(--color-accent);
  transform: translateY(-2px);
}

.copy-btn.copied {
  background-color: #4CAF50;
  border-color: #4CAF50;
  color: white;
}

/* 摘要样式 */
.article-excerpt {
  text-align: center;
  margin-bottom: 30px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.article-excerpt p {
  font-size: 1.1rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0;
}

/* 封面图片样式 */
.article-cover {
  margin-bottom: 40px;
  text-align: center;
}

.cover-image {
  max-width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

/* 元信息样式 */
.article-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.meta-date {
  color: var(--color-accent);
  font-weight: 700;
  font-size: 1rem;
}

.meta-separator {
  color: var(--color-text-muted);
  font-size: 1.2rem;
}

.meta-read-time {
  color: var(--color-text-secondary);
  font-size: 0.95rem;
}

.meta-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  background-color: var(--color-dark-surface);
  color: var(--color-text-primary);
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.85rem;
  border: 1px solid var(--color-dark-border);
}

/* 文章内容样式 */
.article-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: left;
  line-height: 1.8;
}

.article-content :deep(h1) {
  font-size: 2rem;
  color: var(--color-text-primary);
  margin: 2rem 0 1rem 0;
  font-weight: 700;
}

.article-content :deep(h2) {
  font-size: 1.5rem;
  color: var(--color-text-primary);
  margin: 1.8rem 0 1rem 0;
  font-weight: 600;
}

.article-content :deep(h3) {
  font-size: 1.25rem;
  color: var(--color-text-primary);
  margin: 1.5rem 0 0.8rem 0;
  font-weight: 600;
}

.article-content :deep(p) {
  margin-bottom: 1rem;
  color: var(--color-text-secondary);
}

.article-content :deep(pre) {
  background-color: var(--color-dark-surface);
  border: 1px solid var(--color-dark-border);
  border-radius: 6px;
  padding: 16px;
  overflow-x: auto;
  margin: 1.5rem 0;
}

.article-content :deep(code) {
  font-family: 'Courier New', monospace;
  background-color: var(--color-dark-surface);
  color: var(--color-text-primary);
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.9em;
}

.article-content :deep(pre code) {
  background-color: transparent;
  padding: 0;
}

.article-content :deep(ul) {
  margin: 1rem 0;
  padding-left: 2rem;
}

.article-content :deep(li) {
  margin-bottom: 0.5rem;
  color: var(--color-text-secondary);
}

/* 404 页面样式 */
.not-found h1 {
  font-size: 3rem;
  color: var(--color-text-primary);
  margin-bottom: 1rem;
}

.not-found p {
  font-size: 1.2rem;
  color: var(--color-text-secondary);
  margin-bottom: 2rem;
}

.back-btn {
  padding: 12px 24px;
  background-color: var(--color-accent);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.25s ease;
}

.back-btn:hover {
  background-color: var(--color-accent-hover);
  transform: translateY(-2px);
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

  .article-title {
    font-size: 2rem;
  }

  .copy-btn {
    position: static;
    margin-top: 20px;
  }

  .article-meta {
    flex-direction: column;
    gap: 10px;
  }

  .image-grid {
    grid-template-columns: 1fr;
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

  .article-title {
    font-size: 1.6rem;
  }

  .excerpt-en,
  .excerpt-zh {
    font-size: 1rem;
  }
}
</style>