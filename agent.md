# PTA 答题辅助扩展 - Code Wiki

## 1. 项目概述

**项目名称**: fuckpta (PTA 答题辅助扩展)

**项目类型**: Chrome 浏览器扩展 (Manifest V3)

**核心功能**: 帮助用户在 PTA (Programming Teaching Assistant) 编程平台上更高效地完成编程题，提供代码提交、AI 答题、结果分析等功能。

**目标用户**: 使用 PTA 平台进行编程学习和作业的学生

***

## 2. 技术栈

| 类别    | 技术选型               | 说明                                   |
| ----- | ------------------ | ------------------------------------ |
| 前端框架  | Vue 3              | 采用 Composition API                   |
| 状态管理  | Pinia              | 配合 pinia-plugin-persistedstate 实现持久化 |
| 构建工具  | Vite               | 开发体验优化                               |
| 扩展构建  | @crxjs/vite-plugin | Chrome 扩展打包                          |
| 代码高亮  | Prism.js           | 支持 C/C++/Java/Python 等语言             |
| AI 集成 | OpenAI API         | 支持多平台适配器                             |

**主要依赖**:

- `@ai-sdk/openai`: OpenAI SDK
- `primevue`: UI 组件库
- `vue-router`: 路由管理
- `highlight.js`: 代码高亮

***

## 3. 项目架构

```
fuckpta/
├── src/                           # 源代码目录
│   ├── main.js                   # Popup 主入口
│   ├── options-main.js           # 选项页入口
│   ├── data-manager-main.js      # 数据管理入口
│   ├── App.vue                   # Popup 主组件
│   ├── Options.vue               # 选项页主组件
│   ├── DataManager.vue           # 数据管理组件
│   ├── background.js             # 后台 Service Worker
│   ├── content-script.js        # 内容脚本 (核心逻辑)
│   ├── config.js                 # 插件配置
│   ├── style.css                 # 全局样式
│   ├── components/               # Vue 组件
│   │   ├── Sidebar.vue
│   │   ├── AiSettings.vue
│   │   ├── ApiSourceCard.vue
│   │   ├── ApiSourceManagement.vue
│   │   ├── ApiSourceModal.vue
│   │   ├── ChatTest.vue
│   │   ├── DataCard.vue
│   │   ├── DataManagement.vue
│   │   ├── DebugSettings.vue
│   │   ├── GeneralSettings.vue
│   │   ├── AboutSettings.vue
│   │   └── Pagination.vue
│   └── stores/                   # Pinia 状态管理
│       └── codeStore.js          # 代码存储
├── public/                       # 静态资源
│   ├── icon/smallPanel/         # 小图标
│   └── options.js                # 选项页脚本
├── _locales/                     # 国际化
│   └── zh_CN/messages.json       # 中文语言包
├── index.html                    # Popup 页面
├── options.html                 # 选项页面
├── data-manager.html             # 数据管理页面
├── manifest.json                 # 扩展配置
├── package.json                 # 项目配置
├── vite.config.js               # Vite 构建配置
└── ver.json                     # 版本信息
```

***

## 4. 核心模块详解

### 4.1 manifest.json - 扩展配置

**作用**: 定义 Chrome 扩展的元数据、权限和资源映射

**关键配置**:

```json
{
  "manifest_version": 3,          // Manifest V3 版本
  "permissions": ["activeTab", "storage", "tabs"],
  "host_permissions": ["*://pintia.cn/*", "*://raw.githubusercontent.com/*", "*://gitee.com/*"],
  "action": { "default_popup": "index.html" },  // 弹窗页面
  "options_page": "options.html",              // 选项页面
  "background": { "service_worker": "src/background.js" },
  "content_scripts": [{
    "matches": ["*://pintia.cn/*"],
    "js": ["src/content-script.js"],
    "run_at": "document_idle"
  }]
}
```

**设计意图**:

- `host_permissions` 限定扩展仅在 PTA 网站和代码托管平台运行
- `content_scripts` 在页面空闲时自动注入，实现页面交互
- Service Worker 处理后台任务和消息通信

### 4.2 content-script.js - 内容脚本 (核心)

**职责**: 核心业务逻辑，处理页面检测、浮动窗口、AI 答题、代码提交等功能

#### 4.2.1 UI 组件创建函数

| 函数名                              | 功能           | 位置     |
| -------------------------------- | ------------ | ------ |
| `createFloatingWindow()`         | 创建主浮动窗口      | 第2206行 |
| `createCodeEditorHTML()`         | 生成代码编辑器 HTML | 第2527行 |
| `createChoiceQuestionHTML()`     | 生成选择题页面 HTML | 第2718行 |
| `createProblemListHTML()`        | 生成题目列表 HTML  | 第2747行 |
| `createSubmissionResultWindow()` | 创建提交结果窗口     | 第3248行 |

#### 4.2.2 事件初始化函数

| 函数名                          | 功能         | 位置     |
| ---------------------------- | ---------- | ------ |
| `initCodeEditorEvents()`     | 初始化代码编辑器事件 | 第2775行 |
| `initChoiceQuestionEvents()` | 初始化选择题事件   | 第2552行 |
| `initProblemListEvents()`    | 初始化题目列表事件  | 第2770行 |

#### 4.2.3 页面检测函数

| 函数名                         | 功能     | URL 模式                                                             |
| --------------------------- | ------ | ------------------------------------------------------------------ |
| `isProgrammingDetailPage()` | 编程题详情页 | `/problem-sets/{id}/exam/problems/type/7?problemSetProblemId={id}` |
| `isProgrammingListPage()`   | 编程题列表页 | `/problem-sets/{id}/exam/problems/type/7`                          |
| `isChoiceQuestionPage()`    | 选择题页面  | `/problem-sets/{id}/exam/problems/type/2`                          |
| `isSubmissionResultPage()`  | 提交结果页面 | `/problem-sets/{id}/exam/submissions/{id}`                         |

#### 4.2.4 API 请求函数

| 函数名                         | 功能         | 位置     |
| --------------------------- | ---------- | ------ |
| `extractProblemText()`      | 提取题目内容     | 第1030行 |
| `fetchProblemList()`        | 获取题目列表     | 第453行  |
| `fetchChoiceQuestions()`    | 获取选择题列表    | 第943行  |
| `extractSubmissionResult()` | 提取提交结果     | 第3183行 |
| `submitCode()`              | 提交代码 (带重试) | 第2931行 |

#### 4.2.5 AI 相关函数

| 函数名                             | 功能           | 位置     |
| ------------------------------- | ------------ | ------ |
| `detectProvider()`              | 检测 API 提供商类型 | 第1304行 |
| `checkAndUseAI()`               | 检查并调用 AI 答题  | 第1111行 |
| `streamAIResponse()`            | 流式输出 AI 响应   | 第2068行 |
| `generateAIResponse()`          | 非流式 AI 调用    | 第2078行 |
| `batchProcessChoiceQuestions()` | 分批处理选择题      | 第2571行 |

#### 4.2.6 辅助函数

| 函数名                    | 功能            | 位置     |
| ---------------------- | ------------- | ------ |
| `getConfig()`          | 获取用户配置        | 第341行  |
| `getActiveApiConfig()` | 获取当前可用 API 配置 | 第283行  |
| `getEnabledModels()`   | 获取已启用模型列表     | 第264行  |
| `getLollipop()`        | 获取认证 token    | 第2919行 |
| `showToast()`          | 显示 Toast 提示   | 第138行  |
| `showConfirmDialog()`  | 显示确认对话框       | 第2行    |
| `escapeHtml()`         | HTML 转义       | 第1236行 |
| `makeDraggable()`      | 实现拖拽功能        | 第2877行 |
| `debugLog()`           | 调试日志          | 第203行  |

### 4.3 AI 平台适配器系统

项目实现了统一的适配器接口，支持多种 AI 平台:

#### 4.3.1 适配器列表

| 适配器         | 标识符           | 特点           |
| ----------- | ------------- | ------------ |
| OpenAI      | `openai`      | 标准 OpenAI 格式 |
| Anthropic   | `anthropic`   | Claude 系列    |
| Google      | `google`      | Gemini 系列    |
| Azure       | `azure`       | Azure OpenAI |
| DeepSeek    | `deepseek`    | DeepSeek 系列  |
| SiliconFlow | `siliconflow` | 硅基流动         |
| Volcano     | `volcano`     | 火山方舟         |
| Aliyun      | `aliyun`      | 阿里云百炼        |

#### 4.3.2 适配器接口

```javascript
AIAdapter = {
  name: string,           // 适配器名称
  async stream(),         // 流式调用
  async generate()        // 非流式调用
}
```

#### 4.3.3 使用流程

1. `detectProvider()` 根据 URL 和模型名检测平台类型
2. `AIAdapters[provider]` 获取对应适配器
3. 调用适配器的 `stream()` 或 `generate()` 方法

### 4.4 配置文件结构

**默认配置 (defaultConfig)**:

```javascript
{
  autoPopup: true,              // 自动弹出浮动窗口
  language: 'c',                // 编程语言
  aiEnabled: false,             // AI 功能开关
  aiApiKey: '',                 // API 密钥 (旧版)
  aiApiUrl: 'https://api.openai.com/v1',  // API 地址
  aiModel: 'gpt-3.5-turbo',     // AI 模型 (旧版)
  debugMode: false,             // 调试模式
  debugEnabled: false,          // 调试输出开关
  showBuildTime: false,         // 显示构建时间
  extractDelay: 2000,           // 提取延迟
  modelSelectMode: 'random',    // 模型选择模式
  selectedModelId: '',          // 手动选择模型 ID
  apiSources: [],               // API 源列表
  aiSystemPrompt: '...',        // AI 系统提示词
  aiErrorPrompt: '...',        // 错误纠错提示词
  choiceBatchSize: 20,          // 选择题批处理大小
  choicePrompt: '...'           // 选择题提示词
}
```

### 4.5 状态管理 (Pinia Store)

**codeStore** (`src/stores/codeStore.js`):

```javascript
state: {
  code: '',                     // 当前代码
  examId: '',                   // 考试 ID
  problemSetId: '',             // 题集 ID
  problemSetProblemId: '',      // 题目 ID
  lollipop: '',                 // 认证 token
  compiler: 'GCC',              // 编译器
  url: '',                      // 当前 URL
  isSubmitting: false,          // 提交状态
  submitResult: null            // 提交结果
}

actions: {
  setCode(), setExamId(), setProblemSetId(),
  setProblemSetProblemId(), setLollipop(),
  setCompiler(), setUrl(), setSubmitting(), setSubmitResult()
}
```

**持久化配置**: 使用 `pinia-plugin-persistedstate` 配合 Chrome Storage API

### 4.6 后台脚本 (background.js)

**职责**:

1. 首次安装时打开配置页面
2. 监听消息并处理 (`openOptions`, `openOptionsWithTab`)

```javascript
// 监听消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'openOptions') {
    chrome.tabs.create({ url: chrome.runtime.getURL('options.html') });
  }
  // ...
});
```

***

## 5. 数据流与依赖关系

### 5.1 PTA API 调用流程

```
用户访问 PTA 页面
       ↓
content-script.js 检测页面类型
       ↓
调用 fetchProblemList() / extractProblemText() 等
       ↓
从 localStorage 获取 x-lollipop token
       ↓
发送 fetch 请求到 PTA API
       ↓
解析响应数据
```

### 5.2 AI 答题流程

```
用户进入编程题页面
       ↓
checkAutoPopup() 检测并创建浮动窗口
       ↓
extractProblemText() 提取题目
       ↓
checkAndUseAI() 启用 AI 答题
       ↓
getActiveApiConfig() 获取 API 配置
       ↓
detectProvider() 检测平台
       ↓
选择适配器调用 AI
       ↓
streamAIResponse() 流式显示结果
       ↓
submitCode() 提交代码
```

### 5.3 组件依赖关系

```
App.vue (Popup)
  ├── config.js (版本检查)
  └── chrome.storage.local (配置读写)

Options.vue (选项页)
  ├── Sidebar.vue (侧边栏)
  ├── GeneralSettings.vue (通用设置)
  ├── AiSettings.vue (AI 设置)
  ├── ApiSourceManagement.vue (API 源管理)
  ├── ApiSourceCard.vue (API 源卡片)
  ├── ApiSourceModal.vue (API 源编辑弹窗)
  ├── DebugSettings.vue (调试设置)
  ├── AboutSettings.vue (关于页面)
  └── ChatTest.vue (AI 测试)

DataManager.vue (数据管理)
  ├── DataCard.vue (数据卡片)
  └── Pagination.vue (分页)
```

***

## 6. 关键配置说明

### 6.1 API 源配置 (apiSources)

```javascript
{
  name: '源名称',
  url: 'https://api.example.com/v1',
  keys: ['key1', 'key2'],        // 支持多 key 随机使用
  enabled: true,
  models: ['gpt-3.5-turbo', 'gpt-4']
}
```

### 6.2 AI 提示词模板

**系统提示词 (aiSystemPrompt)**:

```
你是专业的编程题 AC 生成器。
语言：{language}

请直接输出**能 AC 的完整代码**，不要解释、不要说明、不要多余内容。
严格遵守格式：换行、空格、缩进必须完全符合题目要求。

以下是题目内容：
{problem content}
```

**错误纠错提示词 (aiErrorPrompt)**:

```
你是专业的编程题 AC 生成器。
语言：{language}
错误类型：{error_type}
编译器提示：{compiler_msg}
测试点提示提示：{data_tip}

请直接输出**能 AC 的完整代码**，不要解释、不要说明、不要多余内容。
严格遵守格式：换行、空格、缩进必须完全符合题目要求。
题目如下：
{problem content}
错误源码如下：
{res_code}
```

### 6.3 题目自动完成流程

1. **获取 examId**: 调用 `/api/problem-sets/{id}/exams`
2. **获取题目**: 调用 `/api/problem-sets/{id}/exam-problems/{id}`
3. **AI 生成**: 使用配置的提示词模板生成代码
4. **提交代码**: POST `/api/exams/{id}/exam-submissions`
5. **处理 429 错误**: 随机等待 5-10 秒后重试

***

## 7. 构建与运行

### 7.1 开发环境

```bash
# 安装依赖 (使用 cnpm)
cnpm install

# 启动开发服务器
cnpm run dev

# 加载扩展
# 在 Chrome 扩展管理页面加载 dist 目录
```

### 7.2 生产构建

```bash
# 构建生产版本
cnpm run build

# 输出目录: dist/
```

### 7.3 构建脚本说明

**!构建.bat**: Windows 构建批处理脚本

**!构建crx.bat**: CRX 格式构建脚本

***

## 8. 扩展页面入口

| 页面           | 入口文件                                                     | 路由     | 用途           |
| ------------ | -------------------------------------------------------- | ------ | ------------ |
| Popup        | index.html, main.js, App.vue                             | 点击扩展图标 | 快速开关、AI 状态切换 |
| Options      | options.html, options-main.js, Options.vue               | 设置页面   | 完整配置界面       |
| Data Manager | data-manager.html, data-manager-main.js, DataManager.vue | 数据管理   | 查看管理提交数据     |

***

## 9. 版本管理

### 9.1 版本注入机制

`vite.config.js` 在构建时从 `ver.json` 注入版本信息:

```javascript
export default defineConfig({
  define: {
    __PLUGIN_VERSION__: JSON.stringify(verJson.version),
    __PLUGIN_CHANGES__: JSON.stringify(verJson.changes)
  }
});
```

### 9.2 版本检查流程

```
checkGlobalVersion()
    ↓
尝试 GitHub 获取 ver.json
    ↓ (失败时)
尝试 Gitee 获取 ver.json
    ↓
compareVersionStr() 比较版本
    ↓
显示更新弹窗 (如有必要)
```

***

## 10. 安全注意事项

1. **API Key 安全**: API 密钥存储在 `chrome.storage.local`，不会同步到云端
2. **XSS 防护**: `escapeHtml()` 函数防止 XSS 攻击
3. **CORS 处理**: 使用 `credentials: 'include'` 保持会话
4. **Host 权限**: 仅限 PTA 和代码托管平台

***

## 11. 常见问题排查

### 11.1 浮动窗口不显示

- 检查 `autoPopup` 配置是否开启
- 确认是否在 PTA 编程题页面

### 11.2 AI 无法生成代码

- 确认 `aiEnabled` 已开启
- 检查 API Key 和 URL 配置
- 查看控制台是否有错误信息

### 11.3 代码提交失败

- 检查网络连接
- 确认 PTA 登录状态
- 查看是否触发频率限制 (429 错误)

### 11.4 调试模式开启

- 点击版本号 5 次即可开启调试模式

***

## 12. 更新日志

| 版本      | 日期 | 主要更新         |
| ------- | -- | ------------ |
| 1.0.1.1 | -  | 当前版本         |
| -       | -  | 支持多 AI 平台适配器 |
| -       | -  | 新增 API 源管理功能 |
| -       | -  | 支持选择题批量处理    |
| -       | -  | 一键完成所有题目功能   |

***

**文档生成时间**: 基于当前代码库分析

**维护者**: lmx12330

**仓库地址**:

- GitHub: <https://github.com/lmengx/fuckpta>
- Gitee: <https://gitee.com/lmx12330/fuckpta>

