<template>
  <article class="blog-card" @click="handleClick">
    <div class="card-image">
      <img :src="article.cover" :alt="article.title" loading="lazy" />
    </div>
    <div class="card-content">
      <div class="card-meta">
        <time :datetime="article.date">{{ formatDate(article.date) }}</time>
      </div>
      <h3 class="card-title">
        {{ article.title }}
      </h3>
      <p class="card-excerpt">
        {{ article.summary }}
      </p>
      <div class="card-tags">
        <span
          v-for="tag in article.tags"
          :key="tag"
          class="tag"
          :aria-label="`Tag: ${tag}`"
        >
          {{ tag }}
        </span>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { BlogPostListItem } from '../types/blog'

interface Props {
  article: BlogPostListItem
}

interface Emits {
  (e: 'click', article: BlogPostListItem): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const handleClick = () => {
  emit('click', props.article)
}
</script>

<style scoped>
.blog-card {
  background-color: #2b2b2b;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  gap: 20px;
  padding: 20px;
  border: 1px solid #333;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.blog-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  border-color: #4a9eff;
}

.blog-card:focus {
  outline: 2px solid #4a9eff;
  outline-offset: 2px;
}

.blog-card:focus-visible {
  outline: 2px solid #4a9eff;
  outline-offset: 2px;
}

.card-image {
  flex-shrink: 0;
  width: 200px;
  height: 125px;
  border-radius: 8px;
  overflow: hidden;
  margin: -20px 0 -20px -20px;
  position: relative;
}

.card-image::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, transparent, rgba(0, 0, 0, 0.1));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.blog-card:hover .card-image::after {
  opacity: 1;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.blog-card:hover .card-image img {
  transform: scale(1.05);
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card-meta {
  display: flex;
  gap: 15px;
  font-size: 0.8rem;
  color: #b0b0b0;
  flex-wrap: wrap;
}

.card-meta time {
  font-weight: 500;
  color: #d0d0d0;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #ffffff;
  line-height: 1.3;
  margin: 0 0 8px 0;
}

.card-excerpt {
  font-size: 0.9rem;
  color: #d0d0d0;
  line-height: 1.4;
  margin: 0 0 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: auto;
  padding-top: 8px;
}

.tag {
  background-color: #3b3b3b;
  color: #4a9eff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid #4a9eff;
  transition: all 0.2s ease;
}

.tag:hover {
  background-color: #4a4a4a;
  transform: translateY(-1px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .blog-card {
    flex-direction: column;
    gap: 15px;
  }

  .card-image {
    width: 100%;
    height: 180px;
    margin: -20px -20px 0 -20px;
  }
}

@media (max-width: 480px) {
  .card-meta {
    font-size: 0.75rem;
  }

  .card-title {
    font-size: 1rem;
  }

  .card-excerpt {
    font-size: 0.85rem;
  }
}
</style>