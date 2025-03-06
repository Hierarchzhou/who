# 聊天应用 API 文档

本文档描述了聊天应用的API端点和功能。

## 基本信息

- 基础URL: `http://localhost:3001/api`
- 所有响应以JSON格式返回

## 端点

### 消息

#### 获取所有消息

```
GET /messages
```

**响应**:
```json
[
  {
    "id": "string",
    "sender": "string",
    "content": "string",
    "timestamp": "string",
    "avatar": "string"
  }
]
```

#### 发送消息

```
POST /messages
```

**请求体**:
```json
{
  "sender": "string",
  "content": "string",
  "avatar": "string"
}
```

**响应**:
```json
{
  "id": "string",
  "sender": "string",
  "content": "string",
  "timestamp": "string",
  "avatar": "string"
}
```

### 用户

#### 注册用户

```
POST /users/register
```

**请求体**:
```json
{
  "username": "string",
  "avatar": "string"
}
```

**响应**:
```json
{
  "username": "string",
  "avatar": "string"
}
```

#### 获取在线用户

```
GET /users/online
```

**响应**:
```json
[
  {
    "username": "string",
    "avatar": "string"
  }
]
```

## 数据存储

API服务器使用本地JSON文件存储数据:

- `messages.json`: 存储所有聊天消息
- `users.json`: 存储所有用户信息

这些文件会在服务器启动时自动创建(如果不存在)。

## 错误处理

如果请求失败，API将返回以下格式的错误响应:

```json
{
  "error": "错误描述"
}
```

HTTP状态码也会相应设置，例如400表示客户端错误，500表示服务器错误。 