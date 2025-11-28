#  AI Chat React

> 一个基于 React 构建的 AI 对话界面，支持 Markdown 渲染、多模态文件上传、会话管理与流式响应。

##  需求梳理

1.	实现对话流数据结构设计，包含角色、内容、时间戳、ID、状态等。
2.	对话列表基本渲染，区分 user / assistant 气泡、头像、角色名。
3.	可平滑滚动的对话区域；新消息自动滚底。
4.	多行输入框，发送按钮； Enter 发送、Shift+Enter 换行。
5.	发送消息后将消息加入列表；输入框清空。
6.	AI 回复模拟，发送user消息后，assistant立刻显示 loading 状态的 AI 消息，延迟后更新为回复内容（仅为示例）。
7.	消息状态管理（loading | sent | error）。
8.	在对话中渲染特定“卡片”消息（名片、文章），并支持点击逻辑（跳转、新页面），在对话中输入名片、文章可以查看对应示例。
9.	Markdown 渲染（标题、列表、加粗、斜体、链接、行内代码）。
10.	流式响应，打字机效果，逐字追加显示。
11.	代码块语法高亮并带“copy”按钮。
12.	平稳滚动与自动滚底。
13.	每条 AI 消息支持“复制内容”、“重新生成”。
14.	错误处理：显示失败原因、重试操作。
15.	持久化：对话保存在 localStorage ，页面刷新后恢复。
16.	长列表性能：虚拟滚动。
17.	历史会话管理，侧边栏实现新建/切换/删除会话。
18.	上下文选择性携带，可以选择发送时带上多少历史。
19.	多模态支持：图片、文档上传/展示，不同类型文档展示对应样式的svg图标。


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
cd ai-chat-react
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

打开浏览器访问 `http://localhost:5173`

## 📂 项目结构

```
/src
  ├── components/       # UI 组件
  │   ├── ChatApp.jsx     # 主应用容器
  │   ├── ChatInterface.jsx # 核心聊天区域
  │   ├── MessageBubble.jsx # 消息气泡
  │   ├── MarkdownRenderer.jsx # Markdown 渲染器
  │   ├── Sidebar.jsx     # 侧边栏会话列表
  │   └── CardMessage.jsx # 卡片消息组件
  ├── hooks/            # 自定义 Hooks
  │   └── useChat.js      # 聊天核心逻辑
  ├── utils/            # 工具函数
  │   ├── fileUtils.js    # 文件处理
  │   └── markdown.js     # Markdown 配置
  ├── styles/           # 样式文件
  │   └── App.css         # 全局样式
  ├── App.jsx           # 根组件
  └── main.jsx          # 入口文件
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
