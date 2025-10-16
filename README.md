# Vue 3 博客详情页面

基于 Vue 3 + TypeScript + Tailwind CSS 构建的现代化博客详情页面，支持暗色像素风格设计。

## 功能特性

### ✨ 页面结构
- **响应式顶部导航** - 与主页一致的暗色像素风格
- **博客内容区** - 完整的文章展示功能
- **固定导航栏** - 滚动时保持可见

### 🎨 设计特性
- **暗色主题** - 深色背景 (#1e1e1e) 配合橙色高亮 (#f79e1b)
- **像素风格** - 等宽字体 (Courier New) 和圆角元素
- **响应式布局** - 桌面端和移动端完美适配

### 🚀 核心功能
- **文章标题展示** - 双语标题 (英文/中文)
- **元信息显示** - 日期、阅读时长、标签展示
- **Markdown 渲染** - 支持 标题、段落、列表、代码块等
- **代码语法高亮** - 代码块美观展示
- **复制功能** - "Copy as Markdown" 一键复制
- **图片展示** - 响应式图片处理，支持双列布局

### 🛠 技术栈
- **Vue 3** - Composition API + TypeScript
- **Vue Router** - 单页面应用路由管理
- **Tailwind CSS** - 实用优先的 CSS 框架
- **自定义样式** - 暗色主题和像素风格设计

## 项目结构

```
src/
├── components/
│   ├── BlogHome.vue          # 博客首页
│   ├── BlogDetail.vue        # 博客详情页
│   └── BlogCard.vue          # 博客卡片组件
├── router/
│   └── index.ts              # 路由配置
├── style.css                 # 全局样式
├── App.vue                   # 根组件
└── main.ts                   # 应用入口
```

## 快速开始

### 安装依赖
```bash
npm install
```

### 开发环境
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览构建结果
```bash
npm run preview
```

## 路由配置

- `/` - 博客首页，显示文章列表
- `/blog/:slug` - 博客详情页，显示具体文章内容

## 组件说明

### BlogDetail.vue
博客详情页面组件，包含：
- 文章标题和元信息
- Markdown 内容渲染
- 复制为 Markdown 功能
- 响应式图片展示
- 导航返回功能

### BlogHome.vue
博客首页组件，包含：
- 顶部导航栏
- 文章列表展示
- 点击跳转到详情页

### BlogCard.vue
文章卡片组件，用于首页列表展示。

## 样式特点

### 颜色方案
- 主背景: #1e1e1e
- 表面色: #2b2b2b
- 边框色: #444
- 主文本: #ffffff
- 次要文本: #a0a0a0
- 高亮色: #f79e1b

### 响应式设计
- 桌面端 (>768px): 双列布局，完整功能
- 移动端 (<768px): 单列布局，简化导航
- 小屏幕 (<480px): 进一步优化空间利用

## 浏览器支持

- Chrome/Edge (推荐)
- Firefox
- Safari
- 现代移动浏览器

## 开发说明

### 添加新文章
1. 在 `BlogHome.vue` 的 `articles` 数组中添加新文章数据
2. 在 `BlogDetail.vue` 的 `articles` 数组中添加对应的详细内容
3. 确保 `slug` 字段在两个组件中保持一致

### 自定义样式
主要样式变量定义在 `src/style.css` 的 `:root` 中，可根据需要调整颜色和字体。

### 路由扩展
如需添加新页面，在 `src/router/index.ts` 中添加路由配置。
