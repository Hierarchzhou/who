<template>
  <div class="login-form">
    <div class="form-container">
      <h1 class="form-title">欢迎来到Vue聊天室</h1>
      <div class="form-group">
        <label for="username">用户名</label>
        <input 
          type="text" 
          id="username" 
          v-model="username" 
          placeholder="请输入用户名" 
          @keyup.enter="login"
        >
      </div>
      <div class="form-group">
        <label>选择头像</label>
        <div class="avatar-options">
          <div 
            v-for="(avatar, index) in avatars" 
            :key="index"
            class="avatar-option"
            :class="{ 'selected': selectedAvatar === avatar }"
            @click="selectedAvatar = avatar"
          >
            <img :src="avatar" alt="头像选项">
          </div>
        </div>
      </div>
      <div class="form-group">
        <label>选择主题</label>
        <div class="theme-options">
          <div 
            v-for="theme in themes" 
            :key="theme.id"
            class="theme-option"
            :class="{ 'selected': selectedTheme === theme.id }"
            @click="selectTheme(theme.id)"
          >
            {{ theme.name }}
          </div>
        </div>
      </div>
      <button 
        class="login-button" 
        @click="login" 
        :disabled="!username.trim()"
      >
        进入聊天室
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginForm',
  data() {
    return {
      username: '',
      selectedAvatar: '/avatars/avatar1.png',
      selectedTheme: localStorage.getItem('chat-theme') || 'discord',
      avatars: [
        '/avatars/avatar1.png',
        '/avatars/avatar2.png',
        '/avatars/avatar3.png',
        '/avatars/avatar4.png',
        '/avatars/avatar5.png',
        '/avatars/avatar6.png'
      ],
      themes: [
        { id: 'discord', name: 'Discord' },
        { id: 'dark', name: '暗黑' }
      ]
    }
  },
  methods: {
    login() {
      if (!this.username.trim()) return;
      
      // 发送登录事件
      this.$emit('login', {
        username: this.username,
        avatar: this.selectedAvatar
      });
    },
    selectTheme(themeId) {
      this.selectedTheme = themeId;
      
      // 移除所有主题类
      document.body.classList.remove('theme-discord', 'theme-dark');
      
      // 添加选中的主题类
      document.body.classList.add(`theme-${themeId}`);
      
      // 保存主题设置
      localStorage.setItem('chat-theme', themeId);
    }
  }
}
</script>

<style scoped>
.login-form {
  width: 100%;
  max-width: 500px;
  padding: 2rem;
  border-radius: 1rem;
  background-color: var(--input-background, rgba(40, 40, 40, 0.8));
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-title {
  text-align: center;
  margin-bottom: 1rem;
  color: var(--header-color, #ffffff);
  font-family: 'Playfair Display', serif;
  letter-spacing: 1px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: bold;
  color: var(--text-color, #e0e0e0);
}

.form-group input {
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
  background-color: var(--input-field-bg, rgba(30, 30, 30, 0.5));
  color: var(--text-color, #e0e0e0);
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
}

.form-group input:focus {
  border-color: var(--primary-color, #5865F2);
  box-shadow: 0 0 0 2px rgba(88, 101, 242, 0.2);
}

.avatar-options {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 0.5rem;
}

.avatar-option {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  border: 3px solid transparent;
  transition: all 0.3s ease;
}

.avatar-option img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-option.selected {
  border-color: var(--primary-color, #5865F2);
  transform: scale(1.1);
  box-shadow: 0 0 10px rgba(88, 101, 242, 0.5);
}

.theme-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.theme-option {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background-color: var(--input-field-bg, rgba(30, 30, 30, 0.5));
  color: var(--text-color, #e0e0e0);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
}

.theme-option:hover {
  background-color: rgba(88, 101, 242, 0.1);
}

.theme-option.selected {
  background-color: var(--primary-color, #5865F2);
  color: #ffffff;
}

.login-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  background-color: var(--primary-color, #5865F2);
  color: #ffffff;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.login-button:hover {
  background-color: var(--secondary-color, #4752C4);
  transform: translateY(-2px);
}

.login-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  transform: none;
}
</style> 