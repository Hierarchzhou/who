<template>
  <div class="server-list">
    <!-- Home Button -->
    <div class="server-section">
      <div 
        class="server-item home-button"
        :class="{ active: currentServerId === 'home' }"
        @click="changeServer({ id: 'home', name: '主页' })"
      >
        <div class="server-icon">
          <img src="/favicon.ico" alt="主页" class="server-icon-image" />
        </div>
        <div class="server-pill" :class="{ active: currentServerId === 'home' }"></div>
      </div>
    </div>

    <!-- Server List Divider -->
    <div class="server-divider"></div>

    <!-- Servers Section -->
    <div class="server-section servers-container">
      <div 
        v-for="server in servers" 
        :key="server.id"
        class="server-item"
        :class="{ active: currentServerId === server.id }"
        @click="changeServer(server)"
      >
        <div class="server-icon">
          <template v-if="server.icon">
            <img :src="server.icon" :alt="server.name" class="server-icon-image" />
          </template>
          <template v-else>
            <div class="server-acronym">{{ getServerAcronym(server.name) }}</div>
          </template>
        </div>
        <div class="server-pill" :class="{ active: currentServerId === server.id }"></div>
        <div v-if="server.hasNotification" class="notification-badge"></div>
        <div v-if="server.mentionCount" class="mention-badge">{{ server.mentionCount }}</div>
      </div>

      <!-- Add Server Button -->
      <div class="server-item add-server" @click="$emit('add-server')">
        <div class="server-icon">
          <span class="add-icon">+</span>
        </div>
        <div class="server-tooltip">添加服务器</div>
      </div>

      <!-- Explore Servers Button -->
      <div class="server-item explore-servers" @click="$emit('explore-servers')">
        <div class="server-icon">
          <span class="compass-icon">🧭</span>
        </div>
        <div class="server-tooltip">探索服务器</div>
      </div>
    </div>

    <!-- Bottom Section -->
    <div class="server-section">
      <div class="server-divider"></div>
      <div class="server-item settings-button" @click="$emit('open-settings')">
        <div class="server-icon">
          <span class="settings-icon">⚙️</span>
        </div>
        <div class="server-tooltip">用户设置</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ServerList',
  data() {
    return {
      // 从localStorage获取服务器列表
      localServers: JSON.parse(localStorage.getItem('chat-servers') || '[]')
    }
  },
  props: {
    // 外部传入的服务器列表
    externalServers: {
      type: Array,
      default: () => []
    },
    currentServerId: {
      type: String,
      default: 'home'
    }
  },
  computed: {
    // 合并本地服务器和外部服务器
    servers() {
      return [...this.localServers, ...this.externalServers]
    }
  },
  methods: {
    changeServer(server) {
      this.$emit('change-server', server);
    },
    getServerAcronym(name) {
      // 获取服务器名称的首字母或第一个字符
      return name
        .split(/\s+/)
        .map(word => word[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
    },
    // 处理localStorage变化
    handleStorageChange(event) {
      if (event.key === 'chat-servers') {
        this.localServers = JSON.parse(event.newValue || '[]');
      }
    }
  },
  // 监听localStorage变化
  mounted() {
    window.addEventListener('storage', this.handleStorageChange);
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.handleStorageChange);
  }
}
</script>

<style scoped>
.server-list {
  width: 72px;
  height: 100vh;
  background-color: var(--background-tertiary);
  display: flex;
  flex-direction: column;
  padding: 12px 0;
  gap: 8px;
  position: relative;
  flex-shrink: 0;
}

.server-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.servers-container {
  flex: 1;
  overflow-y: auto;
  padding: 0 12px;
}

.server-divider {
  width: 32px;
  height: 2px;
  background-color: var(--background-accent);
  border-radius: 1px;
  margin: 4px 0;
}

.server-item {
  position: relative;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.2s ease;
  margin-bottom: 8px;
}

.server-item:hover {
  border-radius: 16px;
  background-color: var(--primary-color);
}

.server-item.active {
  border-radius: 16px;
}

.server-icon {
  width: 48px;
  height: 48px;
  border-radius: inherit;
  background-color: var(--background-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: all 0.2s ease;
}

.server-icon-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.server-acronym {
  color: var(--text-normal);
  font-size: 16px;
  font-weight: 600;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--background-accent);
  border-radius: inherit;
  transition: all 0.2s ease;
}

.server-item:hover .server-acronym {
  color: var(--text-normal);
  background-color: var(--primary-color);
}

.server-item.active .server-acronym {
  color: var(--text-normal);
  background-color: var(--primary-color);
}

.server-pill {
  position: absolute;
  left: -16px;
  width: 8px;
  height: 0;
  background-color: var(--text-normal);
  border-radius: 0 4px 4px 0;
  transition: height 0.2s ease;
}

.server-item:hover .server-pill {
  height: 20px;
}

.server-pill.active {
  height: 40px;
  background-color: var(--text-normal);
}

.notification-badge {
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: var(--primary-color);
  border-radius: 50%;
  bottom: 0;
  right: 0;
}

.mention-badge {
  position: absolute;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  background-color: var(--dnd-color);
  border-radius: 8px;
  color: var(--text-normal);
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  bottom: -4px;
  right: -4px;
}

.add-icon, .compass-icon, .settings-icon {
  font-size: 24px;
  color: var(--interactive-normal);
}

.server-tooltip {
  position: absolute;
  left: 100%;
  margin-left: 8px;
  padding: 8px 12px;
  background-color: var(--background-primary);
  border-radius: 4px;
  color: var(--text-normal);
  font-size: 14px;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transform: translateX(-8px);
  transition: all 0.2s ease;
  z-index: 1000;
}

.server-tooltip::before {
  content: '';
  position: absolute;
  left: -4px;
  top: 50%;
  transform: translateY(-50%) rotate(45deg);
  width: 8px;
  height: 8px;
  background-color: var(--background-primary);
}

.server-item:hover .server-tooltip {
  opacity: 1;
  transform: translateX(0);
}

/* 滚动条样式 */
.servers-container::-webkit-scrollbar {
  width: 0;
  background: transparent;
}

/* 响应式样式 */
@media (max-width: 768px) {
  .server-list {
    width: 100%;
    height: 72px;
    flex-direction: row;
    padding: 0 12px;
  }

  .server-section {
    flex-direction: row;
  }

  .servers-container {
    flex-direction: row;
    overflow-x: auto;
    padding: 12px;
  }

  .server-divider {
    width: 2px;
    height: 32px;
    margin: 0 8px;
  }

  .server-item {
    margin-right: 8px;
    margin-bottom: 0;
  }

  .server-pill {
    display: none;
  }

  .server-tooltip {
    display: none;
  }
}
</style> 