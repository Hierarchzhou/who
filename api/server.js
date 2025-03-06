const express = require('express'); // 引入Express框架
const cors = require('cors'); // 引入CORS中间件，用于处理跨域请求
const bodyParser = require('body-parser'); // 引入body-parser，用于解析请求体
const fs = require('fs'); // 引入文件系统模块，用于读写消息文件
const path = require('path'); // 引入路径模块，用于处理文件路径

const app = express(); // 创建Express应用
const PORT = process.env.PORT || 3002; // 设置服务器端口，默认为3002（修改端口解决冲突）

// 消息数据文件路径
const DATA_FILE = path.join(__dirname, 'messages.json');
// 用户数据文件路径
const USERS_FILE = path.join(__dirname, 'users.json');

// 在线用户列表（内存中存储）
let onlineUsers = [];

// 使用中间件
app.use(cors()); // 启用CORS，允许前端跨域请求
app.use(bodyParser.json()); // 解析JSON格式的请求体

// 确保数据文件存在
function ensureDataFileExists() {
  if (!fs.existsSync(DATA_FILE)) { // 如果文件不存在
    fs.writeFileSync(DATA_FILE, JSON.stringify([])); // 创建一个空的消息数组文件
  }
  if (!fs.existsSync(USERS_FILE)) { // 如果用户文件不存在
    fs.writeFileSync(USERS_FILE, JSON.stringify([])); // 创建一个空的用户数组文件
  }
}

// 读取所有消息
function readMessages() {
  ensureDataFileExists(); // 确保数据文件存在
  const data = fs.readFileSync(DATA_FILE, 'utf8'); // 读取文件内容
  return JSON.parse(data); // 解析JSON数据并返回
}

// 写入消息到文件
function writeMessages(messages) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(messages, null, 2)); // 将消息数组写入文件，格式化JSON以便于阅读
}

// 读取所有用户
function readUsers() {
  ensureDataFileExists(); // 确保数据文件存在
  const data = fs.readFileSync(USERS_FILE, 'utf8'); // 读取文件内容
  return JSON.parse(data); // 解析JSON数据并返回
}

// 写入用户到文件
function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2)); // 将用户数组写入文件，格式化JSON以便于阅读
}

// 获取所有消息的API端点
app.get('/api/messages', (req, res) => {
  try {
    const messages = readMessages(); // 读取所有消息
    res.json(messages); // 返回消息数组
  } catch (error) {
    console.error('获取消息失败:', error);
    res.status(500).json({ error: '获取消息失败' }); // 返回错误信息
  }
});

// 添加新消息的API端点
app.post('/api/messages', (req, res) => {
  try {
    const messages = readMessages(); // 读取现有消息
    const newMessage = {
      id: Date.now(), // 使用时间戳作为消息ID
      user: req.body.user, // 消息发送者
      content: req.body.content, // 消息内容
      timestamp: new Date().toISOString() // 消息时间戳
    };
    
    messages.push(newMessage); // 添加新消息到数组
    writeMessages(messages); // 保存更新后的消息数组
    
    res.status(201).json(newMessage); // 返回新创建的消息
  } catch (error) {
    console.error('添加消息失败:', error);
    res.status(500).json({ error: '添加消息失败' }); // 返回错误信息
  }
});

// 用户上线API端点
app.post('/api/users/online', (req, res) => {
  try {
    const { username, avatar } = req.body; // 获取用户名和头像
    
    // 检查用户是否已经在线
    const existingUserIndex = onlineUsers.findIndex(user => user.username === username);
    
    if (existingUserIndex !== -1) {
      // 用户已在线，更新最后活动时间和头像
      onlineUsers[existingUserIndex].lastActivity = Date.now();
      if (avatar) {
        onlineUsers[existingUserIndex].avatar = avatar;
      }
    } else {
      // 用户不在线，添加到在线用户列表
      onlineUsers.push({
        username,
        avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random`,
        lastActivity: Date.now()
      });
      
      // 检查用户是否已存在于用户文件中
      const users = readUsers();
      const userExists = users.some(user => user.username === username);
      
      if (!userExists) {
        // 添加新用户到用户文件
        users.push({
          username,
          avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random`,
          createdAt: new Date().toISOString()
        });
        writeUsers(users);
      }
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('用户上线失败:', error);
    res.status(500).json({ error: '用户上线失败' });
  }
});

// 用户下线API端点
app.post('/api/users/offline', (req, res) => {
  try {
    const { username } = req.body;
    
    // 从在线用户列表中移除用户
    onlineUsers = onlineUsers.filter(user => user.username !== username);
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('用户下线失败:', error);
    res.status(500).json({ error: '用户下线失败' });
  }
});

// 获取在线用户列表API端点
app.get('/api/users/online', (req, res) => {
  try {
    // 清理超过5分钟不活跃的用户
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    onlineUsers = onlineUsers.filter(user => user.lastActivity > fiveMinutesAgo);
    
    res.json(onlineUsers);
  } catch (error) {
    console.error('获取在线用户失败:', error);
    res.status(500).json({ error: '获取在线用户失败' });
  }
});

// 更新用户头像API端点
app.post('/api/users/avatar', (req, res) => {
  try {
    const { username, avatar } = req.body;
    
    // 更新在线用户的头像
    const onlineUser = onlineUsers.find(user => user.username === username);
    if (onlineUser) {
      onlineUser.avatar = avatar;
    }
    
    // 更新用户文件中的头像
    const users = readUsers();
    const user = users.find(user => user.username === username);
    
    if (user) {
      user.avatar = avatar;
      writeUsers(users);
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ error: '用户不存在' });
    }
  } catch (error) {
    console.error('更新头像失败:', error);
    res.status(500).json({ error: '更新头像失败' });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`API服务器运行在 http://localhost:${PORT}`);
  ensureDataFileExists(); // 确保数据文件存在
}); 