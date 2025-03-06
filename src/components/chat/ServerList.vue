<template>
  <div class="server-list">
    <!-- 服务器列表头部 -->
    <div class="server-list-header">
      <div class="app-logo">
        <img src="/favicon.ico" alt="应用Logo" class="logo-img" />
      </div>
    </div>
    
    <!-- 服务器列表分隔线 -->
    <div class="server-divider"></div>
    
    <!-- 服务器列表项 -->
    <div class="server-items">
      <!-- 主服务器 -->
      <div 
        class="server-item active"
        title="主聊天室"
      >
        <div class="server-icon">
          <span>聊</span>
        </div>
        <div class="server-indicator"></div>
      </div>
      
      <!-- 未来可以添加更多服务器 -->
      <div class="server-item disabled" title="即将推出">
        <div class="server-icon">
          <span>+</span>
        </div>
      </div>
    </div>
    
    <!-- 用户设置按钮 -->
    <div class="user-settings">
      <div class="server-item" title="用户设置">
        <div class="server-icon settings-icon">
          <i class="settings-gear">⚙️</i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ServerList',
  props: {
    // 服务器列表
    servers: {
      type: Array,
      default: () => []
    },
    // 当前选中的服务器
    currentServer: {
      type: Object,
      default: null
    }
  },
  methods: {
    // 切换服务器
    changeServer(server) {
      this.$emit('change-server', server);
    }
  }
}
</script>

<style scoped>
.server-list {
  width: 72px; /* Discord服务器列表宽度 */
  height: 100vh;
  background-color: #202225; /* Discord服务器列表背景色 */
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 0;
  box-sizing: border-box;
  flex-shrink: 0;
}

.server-list-header {
  margin-bottom: 8px;
  width: 100%;
  display: flex;
  justify-content: center;
}

.app-logo {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background-color: #36393f;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-radius 0.2s ease, background-color 0.2s ease;
}

.app-logo:hover {
  border-radius: 12px;
  background-color: var(--primary-color);
}

.logo-img {
  width: 32px;
  height: 32px;
}

.server-divider {
  width: 32px;
  height: 2px;
  background-color: #2d2f32;
  margin: 8px 0;
  border-radius: 1px;
}

.server-items {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.server-item {
  position: relative;
  width: 48px;
  height: 48px;
  margin-bottom: 8px;
  border-radius: 50%;
  cursor: pointer;
  transition: border-radius 0.2s ease, background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.server-item:hover {
  border-radius: 16px;
  background-color: var(--primary-color);
}

.server-item.active {
  border-radius: 16px;
  background-color: var(--primary-color);
}

.server-item.active .server-indicator {
  position: absolute;
  left: -16px;
  width: 8px;
  height: 40px;
  background-color: white;
  border-radius: 0 4px 4px 0;
}

.server-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.server-icon {
  width: 48px;
  height: 48px;
  border-radius: inherit;
  background-color: #36393f;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #dcddde;
  font-size: 18px;
}

.user-settings {
  margin-top: auto;
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 8px;
}

.settings-icon {
  background-color: transparent;
}

.settings-gear {
  font-style: normal;
  font-size: 20px;
}

/* 滚动条样式 */
.server-items::-webkit-scrollbar {
  width: 4px;
}

.server-items::-webkit-scrollbar-thumb {
  background-color: #202225;
  border-radius: 2px;
}

.server-items::-webkit-scrollbar-track {
  background-color: transparent;
}
</style> 