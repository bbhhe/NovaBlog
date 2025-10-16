# 博客图片资源目录

这个目录用于存放博客文章中使用的图片资源。

## 目录结构

```
/assets/
├── covers/          # 文章封面图片
│   ├── claude.png
│   ├── templates.png
│   ├── tailwind.png
│   ├── typescript.png
│   └── vue-performance.png
└── inline/          # 文章内联图片
    ├── template-workflow.png
    ├── tailwind-architecture.png
    ├── virtual-scrolling.png
    ├── e2b-architecture.png
    └── claude-integration.png
```

## 图片使用规范

1. 封面图片：建议尺寸 800x400 像素，支持 JPG、PNG 格式
2. 内联图片：根据内容需要，建议宽度不超过 800 像素
3. 所有图片路径在文章中统一使用 `/assets/` 开头的相对路径
4. 图片命名使用英文、数字和连字符，避免使用空格和特殊字符

## 注意事项

- 目前使用的是占位符文件，实际使用时请替换为真实的图片资源
- 图片文件应经过适当优化，平衡质量和文件大小
- 确保图片具有适当的 alt 属性以提升可访问性