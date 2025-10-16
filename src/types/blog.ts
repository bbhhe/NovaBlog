// 博客文章列表项接口
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

// 标签统计接口
export interface TagCount {
  tag: string
  count: number
}

// 搜索结果接口
export interface SearchResult {
  posts: BlogPostListItem[]
  totalCount: number
  query: string
}

// API响应状态接口
export interface ApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

// 博客配置接口
export interface BlogConfig {
  title: string
  description: string
  author: string
  baseUrl: string
  postsPerPage: number
}