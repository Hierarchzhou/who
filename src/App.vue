<template>
  <div class="app-container">
    <div v-if="!username" class="login-container">
      <LoginForm @login="setUsername" />
    </div>
    <div v-else class="discord-layout">
      <!-- 服务器列表 -->
      <ServerList 
        :external-servers="[]"
        :current-server-id="currentServerId"
        @change-server="changeServer"
        @add-server="showAddServerDialog"
        @explore-servers="showExploreServers"
        @open-settings="openProfileEditor"
      />
      
      <!-- 在线用户列表 -->
      <OnlineUsersSidebar 
        :onlineUsers="onlineUsers" 
        :currentUsername="username"
        @open-profile-editor="openProfileEditor"
      />
      
      <!-- 聊天容器 -->
      <ChatContainer 
        :currentUser="{ username, avatar }" 
        :current-server="currentServer"
        @update-online-users="updateOnlineUsers"
        @open-profile-editor="openProfileEditor"
      />

      <!-- 个人资料编辑器 -->
      <UserProfileEditor
        v-if="showProfileEditor"
        :isOpen="showProfileEditor"
        @close="closeProfileEditor"
        @update-profile="updateProfile"
      />
    </div>
  </div>
</template>

<script>
import LoginForm from './components/auth/LoginForm.vue'
import ChatContainer from './components/chat/ChatContainer.vue'
import ServerList from './components/chat/ServerList.vue'
import OnlineUsersSidebar from './components/chat/OnlineUsersSidebar.vue'
import UserProfileEditor from './components/chat/UserProfileEditor.vue'

export default {
  name: 'App',
  components: {
    LoginForm,
    ChatContainer,
    ServerList,
    OnlineUsersSidebar,
    UserProfileEditor
  },
  data() {
    return {
      username: '',
      avatar: '',
      onlineUsers: [],
      showProfileEditor: false,
      currentServerId: 'home',  // 当前选中的服务器ID
      currentServer: {  // 当前服务器信息
        id: 'home',
        name: '主页'
      },
      // 服务器模板
      serverTemplate: {
        name: 'general',
        description: 'Welcome to the chat channel!',
        channels: [
          {
            id: 'general',
            name: 'general',
            type: 'text',
            description: 'General chat channel for everyone'
          }
        ],
        roles: [
          {
            id: 'admin',
            name: '管理员',
            permissions: ['manage_server', 'manage_channels', 'manage_roles']
          },
          {
            id: 'member',
            name: '成员',
            permissions: ['send_messages', 'read_messages']
          }
        ],
        categories: [
          {
            id: 'text-channels',
            name: '文字频道',
            type: 'category',
            channels: ['general']
          }
        ]
      }
    }
  },
  created() {
    // 从localStorage获取用户信息
    const savedUsername = localStorage.getItem('chat-username')
    const savedAvatar = localStorage.getItem('chat-avatar')
    
    if (savedUsername) {
      this.username = savedUsername
      this.avatar = savedAvatar || ''
    }
    
    // 应用保存的主题
    const savedTheme = localStorage.getItem('chat-theme') || 'discord'
    document.body.classList.add(`theme-${savedTheme}`)

    // 恢复上次选择的服务器
    const savedServerId = localStorage.getItem('current-server-id')
    if (savedServerId) {
      this.currentServerId = savedServerId
    }

    // 初始化默认服务器
    const servers = this.getServers()
    if (servers.length === 0) {
      const defaultServer = this.createNewServer('测试服务器')
      this.currentServerId = defaultServer.id
      this.currentServer = defaultServer
    } else if (this.currentServerId === 'home') {
      // 如果当前是主页，切换到第一个服务器
      this.currentServerId = servers[0].id
      this.currentServer = servers[0]
    }
  },
  methods: {
    setUsername(userData) {
      this.username = userData.username
      this.avatar = userData.avatar || ''
      
      // 保存用户信息到localStorage
      localStorage.setItem('chat-username', this.username)
      if (this.avatar) {
        localStorage.setItem('chat-avatar', this.avatar)
      }
    },
    
    // 更新在线用户列表
    updateOnlineUsers(users) {
      this.onlineUsers = users;
    },
    
    // 打开个人资料编辑器
    openProfileEditor() {
      this.showProfileEditor = true
    },
    
    // 关闭个人资料编辑器
    closeProfileEditor() {
      this.showProfileEditor = false
    },
    
    // 更新个人资料
    updateProfile(updatedProfile) {
      this.username = updatedProfile.username
      this.avatar = updatedProfile.avatar
      this.showProfileEditor = false
      
      // 保存到localStorage
      localStorage.setItem('chat-username', this.username)
      localStorage.setItem('chat-avatar', this.avatar)
    },

    // 切换服务器
    changeServer(server) {
      this.currentServerId = server.id
      this.currentServer = server
      
      // 保存当前服务器ID到localStorage
      localStorage.setItem('current-server-id', server.id)
    },

    // 显示添加服务器对话框
    showAddServerDialog() {
      // 创建一个新的服务器
      const newServer = this.createNewServer('新服务器')
      this.changeServer(newServer)
    },

    // 创建新服务器
    createNewServer(serverName) {
      const serverId = 'server-' + Date.now()
      const newServer = {
        id: serverId,
        name: serverName,
        icon: null,
        description: this.serverTemplate.description,
        channels: [...this.serverTemplate.channels],
        roles: [...this.serverTemplate.roles],
        categories: [...this.serverTemplate.categories],
        members: [],
        createdAt: new Date().toISOString(),
        ownerId: this.username
      }

      // 保存服务器信息到 localStorage
      const servers = JSON.parse(localStorage.getItem('chat-servers') || '[]')
      servers.push(newServer)
      localStorage.setItem('chat-servers', JSON.stringify(servers))

      return newServer
    },

    // 获取所有服务器
    getServers() {
      return JSON.parse(localStorage.getItem('chat-servers') || '[]')
    },

    // 更新服务器信息
    updateServer(server) {
      const servers = this.getServers()
      const index = servers.findIndex(s => s.id === server.id)
      if (index !== -1) {
        servers[index] = server
        localStorage.setItem('chat-servers', JSON.stringify(servers))
      }
    },

    // 显示服务器浏览器
    showExploreServers() {
      // TODO: 实现服务器浏览功能
      console.log('显示服务器浏览器')
    }
  }
}
</script>

<style>
/* 全局样式重置 */
:root {
  /* Discord's color palette */
  --background-primary: #36393f;         /* Main chat background */
  --background-secondary: #2f3136;       /* Sidebar background */
  --background-tertiary: #202225;        /* Server list background */
  --background-accent: #4f545c;          /* Hover states */
  --text-normal: #dcddde;               /* Normal text color */
  --text-muted: #72767d;                /* Muted text color */
  --text-link: #00b0f4;                 /* Link color */
  --header-primary: #fff;               /* Header text color */
  --interactive-normal: #b9bbbe;        /* Interactive elements */
  --interactive-hover: #dcddde;         /* Interactive elements on hover */
  --interactive-active: #fff;           /* Interactive elements when active */
  --primary-color: #5865f2;             /* Brand color */
  --online-color: #3ba55d;              /* Online status */
  --idle-color: #faa81a;                /* Idle status */
  --dnd-color: #ed4245;                 /* Do not disturb status */
  --offline-color: #747f8d;             /* Offline status */
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body, html {
  height: 100%;
  width: 100%;
  font-family: 'gg sans', 'Noto Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;  /* Discord's font stack */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--text-normal);
  background-color: var(--background-tertiary);
}

#app {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
  background-color: var(--background-tertiary);
}

/* Discord布局 */
.discord-layout {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: var(--background-primary);
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background-color: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: var(--background-accent);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: var(--interactive-normal);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chat-main {
    flex-direction: column;
  }
  
  .discord-layout {
    flex-direction: column;
  }
  
  .server-list {
    width: 100% !important;
    height: auto !important;
    flex-direction: row !important;
    padding: 8px !important;
  }
  
  .server-items {
    flex-direction: row !important;
    padding: 0 8px !important;
  }
  
  .server-item {
    margin-right: 8px !important;
    margin-bottom: 0 !important;
  }
}

/* 动画过渡 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* 按钮基础样式 */
button {
  border: none;
  background: none;
  cursor: pointer;
  font-family: inherit;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

button:hover {
  background-color: var(--background-accent);
}

/* 输入框基础样式 */
input, textarea {
  background-color: var(--background-tertiary);
  border: none;
  border-radius: 4px;
  padding: 10px;
  color: var(--text-normal);
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease;
}

input:focus, textarea:focus {
  box-shadow: 0 0 0 2px var(--primary-color);
}
</style>
