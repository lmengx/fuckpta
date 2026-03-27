# PTA 答题辅助扩展

## 项目简介

PTA 答题辅助是一个浏览器扩展，旨在帮助用户在 PTA 编程平台上更高效地完成编程题。该扩展提供了代码提交、AI 答题、结果分析等功能，大大提升了答题效率。

## 快速开始

### 对于普通用户
- **直接安装**：前往 [Release 页面](https://github.com/yourusername/fuckpta/releases) 下载最新版本的扩展包，然后在浏览器扩展管理页面加载已解压的扩展。

### 对于开发者
- **使用 npm 进行包管理**：
  1. 克隆仓库：`git clone https://github.com/yourusername/fuckpta.git`
  2. 安装依赖：`npm install`
  3. 构建项目：`npm run build`
  4. 加载扩展：在浏览器扩展管理页面，加载已解压的扩展（选择 dist 目录）

**提示**：如果觉得开发流程太复杂，建议直接使用 [Cursor](https://cursor.sh/) 编辑器，它集成了 AI 功能，可以更方便地编写和调试扩展代码。

## 主要功能

1. **代码提交**：直接通过 fetch 请求提交代码，无需模拟用户输入
2. **浮动窗口**：在 PTA 答题页面自动弹出，方便快速提交代码
3. **AI 答题**：集成 OpenAI API，自动生成代码
4. **配置管理**：支持导入/导出配置，可自定义 AI 模型和提示词
5. **结果分析**：在提交结果页面显示分析窗口，提供 AI 纠错功能

## 技术栈

- **前端框架**：Vue 3
- **状态管理**：Pinia
- **构建工具**：Vite
- **扩展构建**：@crxjs/vite-plugin
- **浏览器 API**：Chrome Extensions API
- **网络请求**：Fetch API
- **AI 集成**：OpenAI API

## 项目结构

```
fuckpta/
├── src/                   # 源代码目录
│   ├── content-script.js  # 内容脚本，处理页面交互
│   ├── App.vue           # 主应用组件
│   └── stores/            # Pinia 状态管理
│       └── codeStore.js   # 代码存储
├── public/                # 静态资源
│   ├── config.json        # 默认配置
│   └── options.js         # 选项页面脚本
├── options.html           # 选项页面
├── index.html             # 弹窗页面
├── manifest.json          # 扩展配置
├── package.json           # 项目配置
└── README.md              # 项目说明
```

## 核心功能模块

### 1. 内容脚本 (content-script.js)

- **页面检测**：检测当前页面是否为 PTA 答题页面或提交结果页面
- **浮动窗口**：创建和管理浮动窗口，支持拖拽
- **代码提交**：通过 fetch 请求提交代码
- **AI 答题**：调用 OpenAI API 生成代码
- **结果分析**：提取提交结果，提供 AI 纠错

### 2. 配置管理

- **选项页面**：提供可视化配置界面
- **配置项**：
  - 自动弹出浮动窗口
  - 题目提取延迟
  - 编程语言选择
  - AI 启用状态
  - OpenAI API 密钥
  - AI 模型选择
  - 系统提示词
  - 纠错提示词

### 3. AI 功能

- **代码生成**：根据题目描述生成代码
- **代码纠错**：根据提交结果和错误信息生成正确代码
- **提示词模板**：支持自定义提示词，包含语言、错误类型、编译器提示等变量

## 使用方法

1. **安装扩展**：
   - 克隆仓库
   - 运行 `npm install` 安装依赖
   - 运行 `npm run build` 构建项目
   - 在 Chrome 扩展管理页面，加载已解压的扩展（选择 dist 目录）
2. **配置扩展**：
   - 点击扩展图标，进入选项页面
   - 配置 OpenAI API 密钥
   - 选择编程语言和 AI 模型
   - 自定义提示词（可选）
3. **使用扩展**：
   - 打开 PTA 答题页面，浮动窗口会自动弹出
   - 输入代码并点击提交按钮
   - 查看提交结果，结果分析窗口会自动弹出
   - 点击"获取答案"按钮获取 AI 生成的正确代码
   - 点击"一键复制"按钮复制代码

## 关键 API 调用

1. **PTA API**：
   - 提交代码：`POST /api/exams/{examId}/exam-submissions`
   - 获取题目：`GET /api/problem-sets/{problemSetId}/exam-problems/{problemId}`
   - 获取提交结果：`GET /api/submissions/{submissionId}`
2. **OpenAI API**：
   - 代码生成：`POST /chat/completions`

## 注意事项

- 需要配置有效的 OpenAI API 密钥才能使用 AI 功能
- 扩展仅在 PTA 网站上工作
- 请遵守 PTA 平台的使用规则

## 开发指南

1. **开发环境**：
   - 运行 `cnpm run dev` 启动开发服务器
   - 在 Chrome 扩展管理页面，加载已解压的扩展（选择 dist 目录）
2. **构建**：
   - 运行 `cnpm run build` 构建生产版本
3. **调试**：
   - 使用 Chrome 开发者工具调试内容脚本
   - 查看控制台输出获取详细信息

## 未来计划

- 支持更多编程语言
- 优化 AI 提示词，提高代码质量
- 添加代码模板功能
- 支持批量提交和分析

## 贡献

欢迎提交 Issue 和 Pull Request，帮助改进这个项目！
