# Vue聊天应用

一个基于Vue.js的多主题聊天应用，支持用户自定义头像和多种视觉风格。

## 功能特点

- **用户系统**：设置用户名和选择/上传头像
- **实时聊天**：发送和接收消息
- **在线用户**：显示当前在线用户列表
- **主题切换**：支持8种不同视觉风格的主题：
  - Discord风格
  - 暗黑模式
  - 明亮模式
  - 复古风格
  - 文艺电影风格
  - 80年代合成浪潮风格
  - 朋克风格
  - 迪斯科风格

## 项目结构

```
├── api/                # API服务器代码
│   ├── server.js       # API服务器实现
│   └── start-server.js # API服务器启动脚本
│
├── public/             # 静态资源
│   └── avatars/        # 头像图片
│
├── src/                # 源代码
│   ├── assets/         # 静态资源
│   │   ├── images/     # 主题背景图片
│   │   └── themes.css  # 主题样式定义
│   │
│   ├── components/     # Vue组件
│   │   ├── auth/       # 认证相关组件
│   │   │   └── LoginForm.vue    # 登录表单
│   │   │
│   │   └── chat/       # 聊天相关组件
│   │       ├── AvatarSelector.vue  # 头像选择器
│   │       ├── ChatContainer.vue   # 聊天容器
│   │       ├── MessageInput.vue    # 消息输入
│   │       ├── MessageList.vue     # 消息列表
│   │       ├── OnlineUsers.vue     # 在线用户列表
│   │       ├── ThemeSelector.vue   # 主题选择器
│   │       └── UserNameInput.vue   # 用户名输入
│   │
│   ├── App.vue         # 应用主组件
│   └── main.js         # 入口文件
│
├── package.json        # 项目依赖
└── README.md           # 项目说明
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

这将同时启动Vue前端开发服务器和API后端服务器。

- 前端页面: http://localhost:8080
- API服务: http://localhost:3001

### 构建生产版本

```bash
npm run build
```

## 技术栈

- Vue.js 3
- Express.js (API服务器)
- Axios (HTTP请求)
- CSS变量 (主题切换)

## 自定义主题背景

主题背景图片位于 `src/assets/images/` 目录，包括：
- cinematic-bg.jpg
- synthwave-grid.jpg
- punk-bg.jpg
- disco-bg.jpg

您可以替换这些图片来自定义主题背景。
