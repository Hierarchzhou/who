<template>
  <div class="theme-selector">
    <label for="theme-select">主题风格：</label>
    <select 
      id="theme-select" 
      v-model="selectedTheme" 
      @change="changeTheme" 
      class="theme-select"
    >
      <option v-for="theme in themes" :key="theme.id" :value="theme.id">
        {{ theme.name }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'ThemeSelector',
  data() {
    return {
      selectedTheme: localStorage.getItem('chat-theme') || 'natural', // 默认为自然韵律主题
      themes: [
        { id: 'natural', name: '自然韵律' },  // 自然韵律主题
        { id: 'modern', name: '现代清新' }  // 现代清新主题
      ]
    }
  },
  created() {
    // 组件创建时应用保存的主题
    this.applyTheme(this.selectedTheme);
  },
  methods: {
    // 切换主题
    changeTheme() {
      this.applyTheme(this.selectedTheme); // 应用选择的主题
      localStorage.setItem('chat-theme', this.selectedTheme); // 保存主题选择到本地存储
      this.$emit('theme-changed', this.selectedTheme); // 发送主题变更事件到父组件
    },
    
    // 应用主题
    applyTheme(themeId) {
      // 移除所有主题类
      document.body.classList.remove(
        'theme-natural',
        'theme-modern'
      );
      // 添加选择的主题类
      document.body.classList.add(`theme-${themeId}`);
    }
  }
}
</script>

<style scoped>
.theme-selector {
  display: flex;
  align-items: center;
  margin-left: 1rem;
}

.theme-select {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid var(--primary-color);
  background-color: var(--input-background);
  color: var(--text-color);
  margin-left: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.theme-select:hover {
  border-color: var(--secondary-color);
  background-color: var(--other-message-bg);
}

.theme-select:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--primary-color);
}
</style> 