<template>
  <div class="chat-container">
    <!-- 用户名输入界面，当用户未设置昵称时显示 -->
    <UserNameInput 
      v-if="!username" 
      @set-username="setUsername" 
    />
    
    <!-- 聊天界面，当用户已设置昵称时显示 -->
    <div v-else class="chat-interface">
      <header class="chat-header">
        <h2 class="chat-title">Vue聊天室</h2>
        <div class="user-info-container">
          <ThemeSelector />
          <div class="user-info">
            <img 
              :src="userAvatar || getFallbackAvatarUrl()" 
              alt="用户头像" 
              class="user-avatar"
              @error="handleAvatarError"
              @click="openProfileEditor" 
            >
            <span class="current-username">{{ username }}</span>
          </div>
        </div>
      </header>
      
      <div class="chat-main">
        <MessageList 
          :messages="messages" 
          :currentUsername="username" 
          ref="messageList"
          @open-profile-editor="openProfileEditor"
        />
      </div>
      
      <MessageInput @send-message="sendMessage" />
    </div>
    
    <!-- 个人资料编辑器 -->
    <UserProfileEditor 
      :isOpen="showProfileEditor"
      :currentUserInfo="currentUserInfo"
      @close="closeProfileEditor"
      @update-profile="updateProfile"
    />
  </div>
</template>

<script>
import UserNameInput from './UserNameInput.vue';
import MessageList from './MessageList.vue';
import MessageInput from './MessageInput.vue';
import ThemeSelector from './ThemeSelector.vue';
import UserProfileEditor from './UserProfileEditor.vue';
import axios from 'axios';
import { handleAvatarError, getFallbackAvatarUrl } from '../../utils/avatarUtils';
import { useStore } from 'vuex';
import { computed } from 'vue';

export default {
  name: 'ChatContainer',
  components: {
    UserNameInput,
    MessageList,
    MessageInput,
    ThemeSelector,
    UserProfileEditor
  },
  emits: ['update-online-users', 'open-profile-editor'],
  setup() {
    const store = useStore();
    
    // 使用计算属性从store获取用户信息
    const username = computed(() => store.getters['userProfile/username']);
    const userAvatar = computed(() => store.getters['userProfile/avatar']);
    
    return {
      username,
      userAvatar,
      getFallbackAvatarUrl,
      handleAvatarError
    };
  },
  data() {
    return {
      messages: [], // 消息列表
      onlineUsers: [], // 在线用户列表
      apiUrl: 'http://localhost:3001/api/messages', // 消息API地址
      usersApiUrl: 'http://localhost:3001/api/users', // 用户API地址
      pollingInterval: null, // 用于轮询消息的计时器
      onlinePollingInterval: null, // 用于轮询在线用户的计时器
      currentTheme: localStorage.getItem('chat-theme') || 'discord', // 当前主题
      showProfileEditor: false, // 是否显示个人资料编辑器
      currentUserInfo: {} // 当前用户信息
    }
  },
  watch: {
    // 监听在线用户变化，向父组件发送更新事件
    onlineUsers: {
      handler(newValue) {
        this.$emit('update-online-users', newValue);
      },
      deep: true
    }
  },
  created() {
    // 从localStorage恢复用户信息
    const savedUsername = localStorage.getItem('chat-username');
    const savedAvatar = localStorage.getItem('chat-avatar');
    
    if (savedUsername && savedAvatar) {
      this.$store.dispatch('userProfile/updateProfile', {
        username: savedUsername,
        avatar: savedAvatar
      });
    }
  },
  mounted() {
    // 如果用户已登录，获取消息和在线用户
    if (this.username) {
      this.fetchMessages();
      this.fetchOnlineUsers();
      
      // 设置轮询
      this.pollingInterval = setInterval(this.fetchMessages, 3000);
      this.onlinePollingInterval = setInterval(this.fetchOnlineUsers, 5000);
    }
    
    // 应用保存的主题
    document.body.classList.add(`theme-${this.currentTheme}`);
  },
  beforeUnmount() {
    // 清除轮询
    clearInterval(this.pollingInterval);
    clearInterval(this.onlinePollingInterval);
  },
  methods: {
    // 设置用户名和头像
    setUsername(userData) {
      this.$store.dispatch('userProfile/updateProfile', userData);
      
      // 保存到localStorage
      localStorage.setItem('chat-username', userData.username);
      localStorage.setItem('chat-avatar', userData.avatar);
      
      // 注册用户
      this.registerUser();
      
      // 获取消息和在线用户
      this.fetchMessages();
      this.fetchOnlineUsers();
      
      // 设置轮询
      this.pollingInterval = setInterval(this.fetchMessages, 3000);
      this.onlinePollingInterval = setInterval(this.fetchOnlineUsers, 5000);
    },
    
    // 注册用户
    async registerUser() {
      try {
        await axios.post(`${this.usersApiUrl}/register`, {
          username: this.username,
          avatar: this.userAvatar
        });
        console.log('用户注册成功');
      } catch (error) {
        console.error('用户注册失败:', error);
      }
    },
    
    // 获取消息
    async fetchMessages() {
      try {
        const response = await axios.get(this.apiUrl);
        this.messages = response.data;
        // 滚动到底部
        this.$nextTick(() => {
          if (this.$refs.messageList) {
            this.$refs.messageList.scrollToBottom();
          }
        });
      } catch (error) {
        console.error('获取消息失败:', error);
        // 开发阶段如果API未就绪，使用模拟数据
        if (this.messages.length === 0) {
          this.messages = [
            { 
              id: 1, 
              sender: 'System', 
              content: '欢迎来到聊天室!', 
              timestamp: new Date().toISOString(),
              avatar: '/avatars/default.png'
            }
          ];
        }
      }
    },
    
    // 获取在线用户
    async fetchOnlineUsers() {
      try {
        const response = await axios.get(`${this.usersApiUrl}/online`);
        this.onlineUsers = response.data;
      } catch (error) {
        console.error('获取在线用户失败:', error);
        // 开发阶段如果API未就绪，使用模拟数据
        if (this.onlineUsers.length === 0) {
          this.onlineUsers = [
            { username: this.username, avatar: this.userAvatar }
          ];
        }
      }
    },
    
    // 发送消息
    async sendMessage(content) {
      if (!content.trim()) return;
      
      try {
        const response = await axios.post(this.apiUrl, {
          sender: this.username,
          content: content,
          avatar: this.userAvatar
        });
        
        // 将新消息添加到消息列表
        this.messages.push(response.data);
        
        // 滚动到底部
        this.$nextTick(() => {
          if (this.$refs.messageList) {
            this.$refs.messageList.scrollToBottom();
          }
        });
      } catch (error) {
        console.error('发送消息失败:', error);
        
        // 开发阶段如果API未就绪，使用模拟数据
        const mockMessage = {
          id: Date.now(),
          sender: this.username,
          content: content,
          timestamp: new Date().toISOString(),
          avatar: this.userAvatar
        };
        
        this.messages.push(mockMessage);
        
        // 滚动到底部
        this.$nextTick(() => {
          if (this.$refs.messageList) {
            this.$refs.messageList.scrollToBottom();
          }
        });
      }
    },
    // 打开个人资料编辑器
    openProfileEditor() {
      this.$emit('open-profile-editor');
    },
    // 关闭个人资料编辑器
    closeProfileEditor() {
      this.showProfileEditor = false;
    },
    // 更新用户信息
    updateProfile(updatedInfo) {
      // 更新store中的用户信息
      this.$store.dispatch('userProfile/updateProfile', updatedInfo);
      
      // 保存到localStorage
      localStorage.setItem('chat-username', updatedInfo.username);
      localStorage.setItem('chat-avatar', updatedInfo.avatar);
      
      // 更新消息历史中的头像
      this.messages = this.messages.map(message => {
        if (message.sender === updatedInfo.username) {
          return { ...message, avatar: updatedInfo.avatar }; // 更新发送者头像
        }
        return message;
      });
      
      // 注册用户
      this.registerUser();
      
      // 获取消息和在线用户
      this.fetchMessages();
      this.fetchOnlineUsers();
      
      // 设置轮询
      this.pollingInterval = setInterval(this.fetchMessages, 3000);
      this.onlinePollingInterval = setInterval(this.fetchOnlineUsers, 5000);
    }
  }
}
</script>

<style scoped>
.chat-container {
  flex: 1;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--chat-background); /* 使用主题变量 */
  color: var(--text-color); /* 使用主题变量 */
  position: relative;
  z-index: 1;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  background-image: var(--background-image); /* 使用主题变量中的背景图案 */
  background-repeat: repeat;
  background-size: 100px 100px; /* 设置背景图案大小 */
}

.chat-interface {
  display: flex;
  flex-direction: column;
  height: 100%;
  backdrop-filter: blur(5px); /* 添加模糊效果 */
}

.chat-header {
  padding: 1rem 1.5rem;
  background-color: var(--primary-color); /* 使用主题变量 */
  color: var(--header-color); /* 使用主题变量 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--header-shadow);
  position: relative;
  z-index: 2;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1); /* 添加边框 */
  background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.05), transparent); /* 添加渐变效果 */
}

.chat-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2); /* 添加文字阴影 */
}

.user-info-container {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  margin-left: 1rem;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 0.75rem;
  border-radius: 2rem;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.05); /* 添加细微边框 */
  transition: all 0.2s ease; /* 添加过渡效果 */
}

.user-info:hover {
  background-color: rgba(255, 255, 255, 0.15); /* 悬停时背景变亮 */
  transform: translateY(-1px); /* 悬停时轻微上移 */
}

.user-avatar {
  width: 32px; /* 增加头像尺寸 */
  height: 32px; /* 增加头像尺寸 */
  border-radius: 50%;
  object-fit: cover;
  border: var(--avatar-border, 1px solid rgba(255, 255, 255, 0.3));
  box-shadow: var(--avatar-shadow, 0 2px 4px rgba(0, 0, 0, 0.2));
  transition: transform 0.2s ease; /* 添加过渡效果 */
}

.user-avatar:hover {
  transform: scale(1.1); /* 悬停时放大 */
}

.current-username {
  margin-left: 0.5rem;
  font-weight: 500;
  color: var(--text-color);
  mix-blend-mode: overlay;
}

.chat-main {
  display: flex;
  flex: 1;
  overflow: hidden;
  position: relative;
  background-image: var(--background-image); /* 使用主题变量中的背景图案 */
  background-repeat: repeat;
  background-size: 100px 100px; /* 设置背景图案大小 */
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chat-container {
    height: auto;
    flex: 1;
  }
}
</style> 


