<template>
  <div class="username-input-container">
    <h2 class="title">欢迎来到聊天室</h2>
    
    <div class="input-group">
      <label for="username">请输入您的昵称</label>
      <input 
        type="text" 
        id="username"
        v-model="username" 
        placeholder="输入昵称..." 
        @keyup.enter="setUsername"
        class="username-input"
      />
    </div>
    
    <AvatarSelector 
      :username="username"
      @update:avatar="handleAvatarSelected"
    />
    
    <ThemeSelector @theme-changed="handleThemeChanged" />
    
    <button 
      @click="setUsername" 
      class="enter-button"
      :disabled="!username.trim()"
    >
      进入聊天室
    </button>
  </div>
</template>

<script>
import AvatarSelector from './AvatarSelector.vue'
import ThemeSelector from './ThemeSelector.vue'

export default {
  name: 'UserNameInput',
  components: {
    AvatarSelector,
    ThemeSelector
  },
  data() {
    return {
      username: '', // 用户昵称
      selectedAvatar: '', // 选中的头像
      selectedTheme: 'natural' // 默认使用自然韵律主题
    }
  },
  created() {
    // 从 localStorage 获取保存的主题
    const savedTheme = localStorage.getItem('chat-theme');
    if (savedTheme) {
      this.selectedTheme = savedTheme;
      document.body.classList.add(`theme-${savedTheme}`);
    }
    
    // 尝试从localStorage恢复用户名和头像
    const savedUsername = localStorage.getItem('chat-username');
    const savedAvatar = localStorage.getItem('chat-avatar');
    
    if (savedUsername) {
      this.username = savedUsername;
    }
    
    if (savedAvatar) {
      this.selectedAvatar = savedAvatar;
    }
  },
  methods: {
    // 处理头像选择
    handleAvatarSelected(avatarUrl) {
      this.selectedAvatar = avatarUrl;
    },
    
    // 处理主题变更
    handleThemeChanged(theme) {
      this.selectedTheme = theme;
    },
    
    // 设置用户名和头像
    setUsername() {
      if (this.username.trim()) {
        // 将用户名和头像传递给父组件
        this.$emit('set-username', {
          username: this.username,
          avatar: this.selectedAvatar
        });
        
        // 保存到localStorage
        localStorage.setItem('chat-username', this.username);
        localStorage.setItem('chat-avatar', this.selectedAvatar);
        localStorage.setItem('chat-theme', this.selectedTheme);
      }
    }
  }
}
</script>

<style scoped>
.username-input-container {
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 0.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  color: var(--text-color);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.title {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.75rem;
  color: var(--header-color);
}

.input-group {
  margin-bottom: 1.5rem;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.username-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-color: rgba(0, 0, 0, 0.2);
  color: var(--text-color);
  font-size: 1rem;
  box-sizing: border-box;
}

.username-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb, 138, 113, 88), 0.2);
}

.enter-button {
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 1rem;
}

.enter-button:hover:not(:disabled) {
  background-color: var(--secondary-color);
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.enter-button:active:not(:disabled) {
  transform: translateY(0);
}

.enter-button:disabled {
  background-color: rgba(128, 128, 128, 0.3);
  cursor: not-allowed;
}

/* 响应式样式 */
@media (max-width: 480px) {
  .username-input-container {
    margin: 1rem;
    padding: 1rem;
  }
  
  .title {
    font-size: 1.5rem;
  }
}
</style> 