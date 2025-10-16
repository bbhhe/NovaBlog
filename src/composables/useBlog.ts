import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import { blogService } from '../services/blogService'
import type { BlogPost, BlogPostListItem, TagCount, ApiState } from '../types/blog'

/**
 * 博客文章列表Composable
 */
export function useBlogPosts() {
  const state = ref<ApiState<BlogPostListItem[]>>({
    data: null,
    loading: false,
    error: null
  })

  const posts = computed(() => state.value.data || [])
  const loading = computed(() => state.value.loading)
  const error = computed(() => state.value.error)
  const hasPosts = computed(() => posts.value.length > 0)

  const fetchPosts = async () => {
    state.value.loading = true
    state.value.error = null

    try {
      const response = await blogService.getBlogPosts()
      state.value.data = response.data
      state.value.error = response.error
    } catch (err) {
      state.value.error = err instanceof Error ? err.message : 'Failed to fetch posts'
    } finally {
      state.value.loading = false
    }
  }

  const refreshPosts = () => {
    blogService.clearCache()
    return fetchPosts()
  }

  return {
    posts,
    loading,
    error,
    hasPosts,
    fetchPosts,
    refreshPosts
  }
}

/**
 * 单篇博客文章Composable
 */
export function useBlogPost(slug: Ref<string> | string) {
  const state = ref<ApiState<BlogPost>>({
    data: null,
    loading: false,
    error: null
  })

  const post = computed(() => state.value.data)
  const loading = computed(() => state.value.loading)
  const error = computed(() => state.value.error)
  const hasPost = computed(() => !!state.value.data)

  const fetchPost = async (postSlug?: string) => {
    const targetSlug = typeof slug === 'string' ? slug : slug.value
    const finalSlug = postSlug || targetSlug

    if (!finalSlug) {
      state.value.error = 'No slug provided'
      return
    }

    state.value.loading = true
    state.value.error = null

    try {
      const response = await blogService.getBlogPost(finalSlug)
      state.value.data = response.data
      state.value.error = response.error
    } catch (err) {
      state.value.error = err instanceof Error ? err.message : 'Failed to fetch post'
    } finally {
      state.value.loading = false
    }
  }

  const refreshPost = () => {
    const targetSlug = typeof slug === 'string' ? slug : slug.value
    blogService.clearCache()
    return fetchPost(targetSlug)
  }

  return {
    post,
    loading,
    error,
    hasPost,
    fetchPost,
    refreshPost
  }
}

/**
 * 相关文章推荐Composable
 */
export function useRelatedPosts(currentSlug: string, tags: string[]) {
  const relatedPosts = ref<BlogPostListItem[]>([])
  const loading = ref(false)

  const fetchRelatedPosts = async () => {
    if (!currentSlug || !tags.length) {
      relatedPosts.value = []
      return
    }

    loading.value = true
    try {
      relatedPosts.value = await blogService.getRelatedPosts(currentSlug, tags)
    } catch (error) {
      console.error('Failed to fetch related posts:', error)
      relatedPosts.value = []
    } finally {
      loading.value = false
    }
  }

  return {
    relatedPosts,
    loading,
    fetchRelatedPosts
  }
}

/**
 * 标签相关功能Composable
 */
export function useTags() {
  const tags = ref<TagCount[]>([])
  const loading = ref(false)

  const fetchTags = async () => {
    loading.value = true
    try {
      tags.value = await blogService.getAllTags()
    } catch (error) {
      console.error('Failed to fetch tags:', error)
      tags.value = []
    } finally {
      loading.value = false
    }
  }

  const getPopularTags = computed(() => tags.value.slice(0, 10))
  const hasTags = computed(() => tags.value.length > 0)

  return {
    tags,
    loading,
    getPopularTags,
    hasTags,
    fetchTags
  }
}

/**
 * 搜索功能Composable
 */
export function useSearch() {
  const searchResults = ref<BlogPostListItem[]>([])
  const searchQuery = ref('')
  const loading = ref(false)
  const hasSearched = ref(false)

  const searchPosts = async (query: string) => {
    if (!query.trim()) {
      searchResults.value = []
      hasSearched.value = false
      return
    }

    searchQuery.value = query
    loading.value = true
    hasSearched.value = true

    try {
      searchResults.value = await blogService.searchPosts(query)
    } catch (error) {
      console.error('Failed to search posts:', error)
      searchResults.value = []
    } finally {
      loading.value = false
    }
  }

  const clearSearch = () => {
    searchQuery.value = ''
    searchResults.value = []
    hasSearched.value = false
  }

  const hasResults = computed(() => searchResults.value.length > 0)
  const resultCount = computed(() => searchResults.value.length)

  return {
    searchQuery,
    searchResults,
    loading,
    hasSearched,
    hasResults,
    resultCount,
    searchPosts,
    clearSearch
  }
}

/**
 * 按标签搜索Composable
 */
export function useTagSearch() {
  const selectedTag = ref('')
  const tagPosts = ref<BlogPostListItem[]>([])
  const loading = ref(false)

  const searchByTag = async (tag: string) => {
    if (!tag.trim()) {
      selectedTag.value = ''
      tagPosts.value = []
      return
    }

    selectedTag.value = tag
    loading.value = true

    try {
      tagPosts.value = await blogService.searchPostsByTag(tag)
    } catch (error) {
      console.error(`Failed to search posts by tag '${tag}':`, error)
      tagPosts.value = []
    } finally {
      loading.value = false
    }
  }

  const clearTagSearch = () => {
    selectedTag.value = ''
    tagPosts.value = []
  }

  const hasTagPosts = computed(() => tagPosts.value.length > 0)
  const tagPostCount = computed(() => tagPosts.value.length)

  return {
    selectedTag,
    tagPosts,
    loading,
    hasTagPosts,
    tagPostCount,
    searchByTag,
    clearTagSearch
  }
}