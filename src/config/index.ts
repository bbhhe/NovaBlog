/**
 * 应用配置管理
 */
export interface AppConfig {
  // 应用的基础路径
  basePath: string
  // API 数据路径
  dataPath: string
  // 是否为生产环境
  isProduction: boolean
}

/**
 * 获取当前应用配置
 */
export function getAppConfig(): AppConfig {
  // 从环境变量或 Vite 配置中获取 base path
  // Vite 会自动注入 BASE_URL 变量
  const basePath = import.meta.env.BASE_URL || '/'
  const isProduction = import.meta.env.PROD

  return {
    basePath,
    dataPath: `${basePath}data`,
    isProduction
  }
}

/**
 * 创建完整URL路径
 */
export function createUrl(path: string, config?: AppConfig): string {
  const appConfig = config || getAppConfig()

  // 如果已经是完整URL（包含协议），直接返回
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  // 如果已经包含 basePath，直接返回
  if (path.startsWith(appConfig.basePath)) {
    return path
  }

  // 否则添加 base path
  return `${appConfig.basePath}${path.replace(/^\//, '')}`
}