// scripts/export_bases_to_json.js
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const VAULT_PATH = "/mnt/e/binbindoc/PAAR/obsidian_node/NovaBlog"; // 你的 Obsidian 博客笔记目录
const OUTPUT_PATH = "./public/data";
const ASSETS_SRC = "/mnt/e/binbindoc/PAAR/obsidian_node/ZPNG"; // Obsidian 图片源目录
const ASSETS_DEST = "./public/assets"; // 目标 assets 目录

if (!fs.existsSync(OUTPUT_PATH)) fs.mkdirSync(OUTPUT_PATH, { recursive: true });
if (!fs.existsSync(`${OUTPUT_PATH}/posts`)) fs.mkdirSync(`${OUTPUT_PATH}/posts`, { recursive: true });
if (!fs.existsSync(ASSETS_DEST)) fs.mkdirSync(ASSETS_DEST, { recursive: true });

// 复制文件辅助函数
function copyFileSafe(src, dest) {
  if (fs.existsSync(src)) {
    const dir = path.dirname(dest);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

// 递归遍历所有 Markdown 文件
function getAllMarkdownFiles(dir) {
  const files = [];

  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);

    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (item.endsWith('.md')) {
        files.push(fullPath);
      }
    }
  }

  traverse(dir);
  return files;
}

const files = getAllMarkdownFiles(VAULT_PATH);
const postsList = [];

for (const file of files) {
  const filePath = file;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data: frontmatter, content } = matter(raw);

  // 支持中英文字段名：published 或 是否发布
  if (!frontmatter.published && !frontmatter["是否发布"]) continue;

  const slug = frontmatter.slug || path.basename(filePath, ".md");

  // 提取并处理图片
  const extractedImages = [];
  let processedContent = content;
  let processedHtml = "";

  // 处理 Obsidian 格式的图片 [[image.png]] 和 markdown 格式的图片 ![alt](image.png)
  const obsidianImageRegex = /\!\[\[(.*?)\]\]/g;
  const markdownImageRegex = /!\[.*?\]\((.*?)\)/g;

  // 收集所有需要处理的图片
  const allImages = [];

  // 提取 Obsidian 格式图片
  let obsidianMatch;
  while ((obsidianMatch = obsidianImageRegex.exec(content)) !== null) {
    const imageName = obsidianMatch[1];
    allImages.push({
      original: obsidianMatch[0],
      name: imageName,
      type: 'obsidian'
    });
  }

  // 提取 Markdown 格式图片
  let markdownMatch;
  while ((markdownMatch = markdownImageRegex.exec(content)) !== null) {
    const imagePath = markdownMatch[1];
    if (!imagePath.startsWith('http')) { // 只处理本地图片
      allImages.push({
        original: markdownMatch[0],
        path: imagePath,
        type: 'markdown'
      });
    }
  }

  // URL编码辅助函数
  function encodeUrlPath(fileName) {
    return fileName.replace(/ /g, '%20');
  }

  // 处理图片并替换内容
  for (const img of allImages) {
    let sourceFileName = "";
    let webPath = "";

    if (img.type === 'obsidian') {
      sourceFileName = img.name;
      webPath = `/assets/${encodeUrlPath(img.name)}`;
    } else if (img.type === 'markdown') {
      sourceFileName = path.basename(img.path);
      webPath = `/assets/${encodeUrlPath(sourceFileName)}`;
    }

    // 复制图片文件
    const sourcePath = path.join(ASSETS_SRC, sourceFileName);
    const destPath = path.join(ASSETS_DEST, sourceFileName);
    copyFileSafe(sourcePath, destPath);

    // 替换内容中的图片路径
    if (img.type === 'obsidian') {
      processedContent = processedContent.replace(img.original, `![${sourceFileName}](${webPath})`);
    } else {
      processedContent = processedContent.replace(img.original, `![${sourceFileName}](${webPath})`);
    }

    extractedImages.push({
      name: sourceFileName,
      webPath: webPath
    });
  }

  const html = marked.parse(processedContent);

  // 处理封面逻辑：优先使用 frontmatter.cover，否则取第一张图片
  let coverImage = frontmatter.cover || "";

  // 如果没有设置 cover，尝试从内容中提取第一张图片
  if (!coverImage && extractedImages.length > 0) {
    coverImage = extractedImages[0].webPath;
  }

  // 处理 frontmatter 中的 Obsidian 格式 cover
  if (coverImage && coverImage.includes('[[') && coverImage.includes(']]')) {
    const coverMatch = coverImage.match(/\[\[(.*?)\]\]/); // 修正正则表达式，去掉 !
    if (coverMatch) {
      const coverFileName = coverMatch[1];
      const coverSourcePath = path.join(ASSETS_SRC, coverFileName);
      const coverDestPath = path.join(ASSETS_DEST, coverFileName);
      copyFileSafe(coverSourcePath, coverDestPath);
      coverImage = `/assets/${encodeUrlPath(coverFileName)}`;
    }
  }

  // 构建详情页 JSON
  const postData = {
    title: frontmatter.title || slug,
    slug,
    date: frontmatter.date || new Date().toISOString().split("T")[0],
    tags: frontmatter.tags || [],
    cover: coverImage,
    summary: frontmatter.summary || "",
    content: processedContent, // 使用处理后的内容
    html, // 使用处理后的HTML
    published: true,
  };

  fs.writeFileSync(
    `${OUTPUT_PATH}/posts/${slug}.json`,
    JSON.stringify(postData, null, 2),
    "utf8"
  );

  // 列表页数据
  postsList.push({
    title: postData.title,
    slug: postData.slug,
    date: postData.date,
    tags: postData.tags,
    summary: postData.summary,
    cover: postData.cover, // 使用处理后的cover
    published: true,
  });
}

// 按时间排序
postsList.sort((a, b) => new Date(b.date) - new Date(a.date));

// 输出列表数据
fs.writeFileSync(`${OUTPUT_PATH}/posts.json`, JSON.stringify(postsList, null, 2), "utf8");

console.log(`✅ 导出完成：${postsList.length} 篇文章已生成！`);
