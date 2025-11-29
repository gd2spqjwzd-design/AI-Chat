#  AI-Chat

> 一个基于 React 构建的 AI 对话界面，支持 Markdown 渲染、多模态文件上传、会话管理与流式响应。

##  技术栈

- **核心框架**: React 18
- **构建工具**: Vite
- **语言**: JavaScript (ES6+)
- **样式**: CSS3, Flexbox
- **状态管理**: React Hooks (Custom Hooks)
- **Markdown**: `react-markdown`

## 安装与运行

### 前置要求

- Node.js (推荐 v14 或更高版本)
- npm 或 yarn

### 快速开始

1. **克隆项目**

```bash
git clone <项目仓库地址>
cd AI-Chat-main
```

2. **安装依赖和相关包**

```bash
npm install
npm install react-markdown remark-gfm rehype-highlight
```

3. **启动开发服务器**

```bash
npm run dev
```

4. **访问应用**

打开浏览器访问对应地址

## 📂 项目结构

```
AI-Chat\
├── README.md
├── index.html
├── mock.json
├── package-lock.json
├── package.json
├── public\
│   └── (空目录)
├── src\
│   ├── App.jsx
│   ├── components\
│   │   ├── CardMessage.jsx
│   │   ├── ChatApp.jsx
│   │   ├── ChatInterface.jsx
│   │   ├── MarkdownRenderer.jsx
│   │   ├── MessageBubble.jsx
│   │   └── Sidebar.jsx
│   ├── hooks\
│   │   └── useChat.js
│   ├── main.jsx
│   ├── styles\
│   │   └── App.css
│   └── utils\
│       ├── fileUtils.jsx
│       └── markdown.js
└── vite.config.js

```

##  使用指南

###  开始聊天
1. 在底部输入框输入内容。
2. 按 `Enter` 发送，或点击右侧发送按钮。
3. 观察 AI 的流式回复。

###  上传文件
1. 点击输入框左侧的 `+` 号或直接拖拽文件。
2. 支持预览图片，其他文档显示对应图标。

###  会话管理
- **新建**：点击侧边栏顶部 `+` 按钮。
- **切换**：点击侧边栏的历史记录。
- **删除**：悬停在历史记录上点击删除图标。

###  搜索历史
1. 点击顶部的搜索图标。
2. 输入关键词快速定位历史消息。

##  组件架构说明

| 组件 | 说明 |
|------|------|
| **ChatApp** | 全局布局容器，管理侧边栏状态与当前会话 ID。 |
| **ChatInterface** | 业务核心，处理输入、发送、文件上传及消息列表渲染。 |
| **MessageBubble** | 消息展示单元，区分 User/AI 样式，集成 Markdown 渲染。 |
| **MarkdownRenderer** | 封装 Markdown 转换逻辑，处理代码高亮。 |
| **Sidebar** | 会话列表管理，提供增删改查入口。 |
| **useChat (Hook)** | 核心逻辑层，封装了消息队列、模拟回复、本地存储同步等逻辑。 |

## 致谢

感谢您的使用！如有任何问题或建议，欢迎联系。邮箱：DrunkBoat@yeah.net
