import { getAppConfig, createUrl } from '../config'

// 博客文章列表接口
export interface BlogPostListItem {
  title: string
  slug: string
  date: string
  tags: string[]
  summary: string
  cover: string
  published: boolean
}

// 博客文章详情接口
export interface BlogPost extends BlogPostListItem {
  content: string
  html: string
  readingTime?: string
}

// API响应接口
interface ApiResponse<T> {
  data: T | null
  error: string | null
  loading: boolean
}

/**
 * 博客数据服务类
 */
class BlogService {
  private cache = new Map<string, any>()
  private config = getAppConfig()

  /**
   * 获取API基础URL
   */
  private getApiUrl(path: string): string {
    return createUrl(path, this.config)
  }

  /**
   * 处理图片路径，确保在生产环境有正确的base路径
   */
  private getImagePath(originalPath: string): string {
    // 使用createUrl函数处理路径
    return createUrl(originalPath, this.config)
  }

  /**
   * 处理HTML内容中的图片路径
   */
  private processHtmlImages(html: string): string {
    const config = this.config
    return html.replace(
      /src="\/assets\/([^"]+)"/g,
      `src="${config.basePath}assets/$1"`
    )
  }

  /**
   * 获取博客文章列表
   */
  async getBlogPosts(): Promise<ApiResponse<BlogPostListItem[]>> {
    try {
      const response = await fetch(this.getApiUrl('/data/posts.json'))
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()

      // 过滤已发布的文章并按日期排序，同时处理图片路径
      const publishedPosts = data
        .filter((post: BlogPostListItem) => post.published)
        .map((post: BlogPostListItem) => ({
          ...post,
          cover: post.cover ? this.getImagePath(post.cover) : post.cover
        }))
        .sort((a: BlogPostListItem, b: BlogPostListItem) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        )

      return {
        data: publishedPosts,
        error: null,
        loading: false
      }
    } catch (error) {
      console.error('Failed to fetch blog posts:', error)
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        loading: false
      }
    }
  }

  /**
   * 根据slug获取博客文章详情
   */
  async getBlogPost(slug: string): Promise<ApiResponse<BlogPost>> {
    // 检查缓存
    if (this.cache.has(slug)) {
      return {
        data: this.cache.get(slug),
        error: null,
        loading: false
      }
    }

    try {
      const response = await fetch(this.getApiUrl(`/data/posts/${slug}.json`))
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Blog post '${slug}' not found`)
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()

      // 只有已发布的文章才能访问
      if (!data.published) {
        throw new Error(`Blog post '${slug}' is not published`)
      }

      // 处理图片路径
      if (data.cover) {
        data.cover = this.getImagePath(data.cover)
      }

      // 处理HTML内容中的图片路径
      if (data.html) {
        data.html = this.processHtmlImages(data.html)
      }

      // 计算阅读时间（如果未提供）
      if (!data.readingTime) {
        data.readingTime = this.calculateReadingTime(data.content)
      }

      // 缓存数据
      this.cache.set(slug, data)

      return {
        data,
        error: null,
        loading: false
      }
    } catch (error) {
      console.error(`Failed to fetch blog post '${slug}':`, error)
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        loading: false
      }
    }
  }

  /**
   * 获取相关文章推荐
   */
  async getRelatedPosts(currentSlug: string, tags: string[]): Promise<BlogPostListItem[]> {
    try {
      const { data: allPosts } = await this.getBlogPosts()
      if (!allPosts) return []

      // 根据标签相似度推荐相关文章
      const relatedPosts = allPosts
        .filter(post => post.slug !== currentSlug && post.published)
        .map(post => ({
          ...post,
          score: this.calculateRelevanceScore(post.tags, tags)
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3) // 取前3篇相关文章
        .map(({ score, ...post }) => post)

      return relatedPosts
    } catch (error) {
      console.error('Failed to get related posts:', error)
      return []
    }
  }

  /**
   * 根据标签搜索文章
   */
  async searchPostsByTag(tag: string): Promise<BlogPostListItem[]> {
    try {
      const { data: allPosts } = await this.getBlogPosts()
      if (!allPosts) return []

      return allPosts.filter(post =>
        post.published && post.tags.includes(tag)
      )
    } catch (error) {
      console.error(`Failed to search posts by tag '${tag}':`, error)
      return []
    }
  }

  /**
   * 搜索文章（按标题和摘要）
   */
  async searchPosts(query: string): Promise<BlogPostListItem[]> {
    try {
      const { data: allPosts } = await this.getBlogPosts()
      if (!allPosts) return []

      const lowerQuery = query.toLowerCase()
      return allPosts.filter(post =>
        post.published && (
          post.title.toLowerCase().includes(lowerQuery) ||
          post.summary.toLowerCase().includes(lowerQuery)
        )
      )
    } catch (error) {
      console.error(`Failed to search posts with query '${query}':`, error)
      return []
    }
  }

  /**
   * 获取所有标签
   */
  async getAllTags(): Promise<{ tag: string; count: number }[]> {
    try {
      const { data: allPosts } = await this.getBlogPosts()
      if (!allPosts) return []

      const tagCounts = new Map<string, number>()

      allPosts.forEach(post => {
        if (post.published) {
          post.tags.forEach(tag => {
            tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
          })
        }
      })

      return Array.from(tagCounts.entries())
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count)
    } catch (error) {
      console.error('Failed to get all tags:', error)
      return []
    }
  }

  /**
   * 计算文章阅读时间
   */
  private calculateReadingTime(content: string): string {
    // 平均阅读速度：每分钟200个单词
    const wordsPerMinute = 200
    const words = content.trim().split(/\s+/).length
    const minutes = Math.ceil(words / wordsPerMinute)

    return `${minutes} min read`
  }

  /**
   * 计算文章相关性得分
   */
  private calculateRelevanceScore(postTags: string[], targetTags: string[]): number {
    const commonTags = postTags.filter(tag => targetTags.includes(tag))
    return commonTags.length
  }

  /**
   * 清除缓存
   */
  clearCache(): void {
    this.cache.clear()
  }
}

// 创建单例实例
export const blogService = new BlogService()

// 导出类型（已在上方定义，无需重复导出）