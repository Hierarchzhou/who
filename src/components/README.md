# Vue聊天应用组件文档

本文档描述了Vue聊天应用的组件结构和功能。

## 组件结构

```
components/
├── auth/
│   └── LoginForm.vue       # 用户登录表单
│
└── chat/
    ├── AvatarSelector.vue  # 头像选择器
    ├── ChatContainer.vue   # 聊天容器
    ├── MessageInput.vue    # 消息输入框
    ├── MessageList.vue     # 消息列表
    ├── OnlineUsers.vue     # 在线用户列表
    ├── ThemeSelector.vue   # 主题选择器
    └── UserNameInput.vue   # 用户名输入
```

## 组件详情

### App.vue
项目的主组件，负责整体布局和状态管理。
- 管理用户登录状态
- 加载保存的主题

### 认证相关组件

#### LoginForm.vue
登录表单组件，允许用户设置名称、选择头像和主题。
- 输入用户名
- 选择预设头像
- 选择主题
- 将用户信息传递给父组件

### 聊天相关组件

#### ChatContainer.vue
聊天主容器，包含所有聊天功能。
- 管理消息数据
- 获取和发送消息到API
- 获取在线用户列表
- 轮询更新消息和用户列表

#### MessageList.vue
显示聊天消息列表。
- 渲染所有消息
- 区分自己和他人的消息
- 格式化消息时间戳
- 自动滚动到最新消息

#### MessageInput.vue
消息输入和发送组件。
- 输入消息文本区域
- 发送消息按钮
- 支持Enter键发送

#### OnlineUsers.vue
显示当前在线用户列表。
- 显示用户头像
- 显示用户名
- 高亮显示当前用户

#### UserNameInput.vue
用户初始设置界面。
- 用户名输入
- 头像选择
- 主题选择
- 将用户信息传递给父组件

#### ThemeSelector.vue
主题选择器组件。
- 提供多种主题选项
- 切换主题
- 保存主题选择到localStorage

#### AvatarSelector.vue
头像选择器组件。
- 显示当前头像
- 提供预设头像列表
- 支持自定义头像URL
- 选择头像后通知父组件

## 组件通信

组件使用以下方式进行通信：
- Props：父组件向子组件传递数据
- Events：子组件向父组件发送数据
- localStorage：保存用户设置和主题选择

## 数据流

1. 用户首次访问时，需要设置用户名和头像
2. 用户信息保存到localStorage，并注册到API服务器
3. ChatContainer获取消息和在线用户列表
4. 用户发送消息时，通过API添加新消息
5. 定时轮询更新消息和在线用户列表

## 主题系统

- 所有主题定义在`src/assets/themes.css`中
- 通过CSS变量实现主题切换
- ThemeSelector组件负责管理主题切换
- 主题切换通过向body添加对应的类名实现 