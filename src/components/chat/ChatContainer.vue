<template>
  <div class="chat-container">
    <!-- 用户名输入界面，当用户未设置昵称时显示 -->
    <UserNameInput 
      v-if="!username" 
      @set-username="setUsername" 
    />
    
    <!-- 聊天界面，当用户已设置昵称时显示 -->
    <div v-else class="chat-interface">
      <!-- 频道头部 -->
      <header class="chat-header">
        <div class="channel-info">
          <span class="channel-hash">{{ currentChannel?.type === 'voice' ? '🔊' : '#' }}</span>
          <h2 class="channel-name">{{ currentChannel?.name || 'general' }}</h2>
          <div class="channel-topic">
            {{ currentChannel?.topic || '欢迎来到聊天频道！' }}
          </div>
        </div>
        
        <div class="header-actions">
          <div class="action-buttons">
            <button 
              v-if="currentChannel?.type === 'voice'"
              class="icon-button" 
              :class="{ active: isInVoiceChannel }"
              title="加入语音频道"
              @click="toggleVoiceChannel"
            >
              <span class="icon">{{ isInVoiceChannel ? '🎤' : '🔇' }}</span>
            </button>
            <button class="icon-button" title="Pin Messages">
              <span class="icon">📌</span>
            </button>
            <button class="icon-button" title="Show Member List">
              <span class="icon">👥</span>
            </button>
            <ThemeSelector />
          </div>
          
          <div class="user-info" @click="openProfileEditor">
            <div class="user-status-indicator" :class="{ online: true }"></div>
            <img 
              :src="userAvatar || getFallbackAvatarUrl()" 
              alt="用户头像" 
              class="user-avatar"
              @error="handleAvatarError"
            >
            <span class="current-username">{{ username }}</span>
          </div>
        </div>
      </header>
      
      <div class="chat-main">
        <MessageList 
          :messages="filteredMessages" 
          :currentUsername="username" 
          ref="messageList"
          @open-profile-editor="openProfileEditor"
        />
      </div>
      
      <MessageInput 
        :placeholder="getInputPlaceholder"
        :disabled="isInputDisabled"
        @send-message="sendMessage" 
      />
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
import { computed, ref } from 'vue';

export default {
  name: 'ChatContainer',
  components: {
    UserNameInput,
    MessageList,
    MessageInput,
    ThemeSelector,
    UserProfileEditor
  },
  props: {
    currentUser: {
      type: Object,
      required: true
    },
    currentServer: {
      type: Object,
      default: () => ({
        id: 'home',
        name: 'general',
        description: 'Welcome to the chat channel!'
      })
    },
    currentChannel: {
      type: Object,
      default: null
    }
  },
  emits: ['update-online-users', 'open-profile-editor'],
  setup(props) {
    const store = useStore();
    const isInVoiceChannel = ref(false);
    
    // 使用计算属性从store获取用户信息
    const username = computed(() => store.getters['userProfile/username']);
    const userAvatar = computed(() => store.getters['userProfile/avatar']);
    
    // 过滤当前频道的消息
    const filteredMessages = computed(() => {
      if (!props.currentChannel) return [];
      return store.getters['messages/channelMessages'](props.currentChannel.id);
    });

    // 获取输入框占位符文本
    const getInputPlaceholder = computed(() => {
      if (!props.currentChannel) return '选择一个频道开始聊天';
      return `发送消息到 ${props.currentChannel.type === 'voice' ? '🔊' : '#'}${props.currentChannel.name}`;
    });

    // 判断输入框是否禁用
    const isInputDisabled = computed(() => {
      return !props.currentChannel || 
             (props.currentChannel.type === 'voice' && !isInVoiceChannel.value);
    });

    return {
      username,
      userAvatar,
      filteredMessages,
      getInputPlaceholder,
      isInputDisabled,
      isInVoiceChannel,
      getFallbackAvatarUrl,
      handleAvatarError
    };
  },
  data() {
    return {
      messages: [], // 消息列表
      onlineUsers: [], // 在线用户列表
      apiUrl: 'http://localhost:3002/api/messages', // 消息API地址
      usersApiUrl: 'http://localhost:3002/api/users', // 用户API地址
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
    },
    // 监听服务器变化，重新加载消息
    'currentServer.id': {
      handler(newServerId) {
        if (newServerId) {
          this.loadServerMessages(newServerId);
        }
      },
      immediate: true
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
    
    // 加载服务器特定的消息
    loadServerMessages(serverId) {
      const key = `server-messages-${serverId}`;
      const savedMessages = localStorage.getItem(key);
      this.messages = savedMessages ? JSON.parse(savedMessages) : [];
    },

    // 保存服务器消息
    saveServerMessages() {
      const key = `server-messages-${this.currentServer.id}`;
      localStorage.setItem(key, JSON.stringify(this.messages));
    },

    // 发送消息
    async sendMessage(content) {
      if (!content.trim() || !this.currentChannel) return;
      
      try {
        const messageData = {
          channelId: this.currentChannel.id,
          content: content.trim(),
          sender: this.username,
          avatar: this.userAvatar,
          timestamp: new Date().toISOString()
        };

        // 发送消息到store
        await this.$store.dispatch('messages/sendMessage', messageData);
        
        // 滚动到底部
        this.$nextTick(() => {
          if (this.$refs.messageList) {
            this.$refs.messageList.scrollToBottom();
          }
        });
      } catch (error) {
        console.error('发送消息失败:', error);
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
    },
    // 切换语音频道状态
    toggleVoiceChannel() {
      if (this.currentChannel?.type !== 'voice') return;
      this.isInVoiceChannel = !this.isInVoiceChannel;
      // TODO: 实现语音频道的加入/退出逻辑
    }
  }
}
</script>

<style scoped>
.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--background-primary);
}

.chat-interface {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-header {
  height: 48px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--background-primary);
  border-bottom: 1px solid var(--background-tertiary);
  flex-shrink: 0;
}

.channel-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.channel-hash {
  color: var(--text-muted);
  font-size: 24px;
  font-weight: 300;
}

.channel-name {
  color: var(--header-primary);
  font-size: 16px;
  font-weight: 600;
}

.channel-topic {
  color: var(--text-muted);
  font-size: 14px;
  margin-left: 12px;
  padding-left: 12px;
  border-left: 1px solid var(--background-accent);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon-button {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 4px;
}

.icon-button:hover {
  color: var(--text-normal);
  background-color: var(--background-modifier-hover);
}

.icon-button.active {
  color: var(--text-normal);
  background-color: var(--background-modifier-selected);
}

.chat-main {
  flex: 1;
  overflow-y: auto;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.user-info:hover {
  background-color: var(--background-modifier-hover);
}

.user-status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--online-indicator);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.current-username {
  color: var(--header-primary);
  font-size: 14px;
  font-weight: 500;
}

/* 响应式样式 */
@media (max-width: 768px) {
  .channel-topic {
    display: none;
  }
  
  .action-buttons {
    display: none;
  }
  
  .chat-header {
    padding: 0 8px;
  }
  
  .user-info {
    padding: 4px;
  }
  
  .current-username {
    display: none;
  }
}
</style> 


