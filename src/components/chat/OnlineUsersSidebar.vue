<template>
  <div class="online-users-sidebar">
    <!-- 频道信息 -->
    <div class="channel-info">
      <h3 class="channel-name">general</h3>
      <button class="channel-button">
        <span class="icon">⚙️</span>
      </button>
    </div>

    <!-- 用户分组列表 -->
    <div class="users-list">
      <!-- 在线用户组 -->
      <div class="user-group">
        <div class="group-header">
          <span class="group-name">在线 — {{ onlineUsers.length }}</span>
          <button class="group-collapse-button">
            <span class="icon">▼</span>
          </button>
        </div>

        <!-- 当前用户 -->
        <div 
          class="user-item current-user" 
          v-if="currentUsername"
          @click="handleAvatarClick"
        >
          <div class="user-avatar-container">
            <img 
              :src="getCurrentUserAvatar()" 
              alt="当前用户头像" 
              class="user-avatar"
              @error="onAvatarError"
            />
            <div 
              :class="['status-indicator', currentUserStatus]"
              :title="getStatusText(currentUserStatus)"
            ></div>
          </div>
          <div class="user-info">
            <div class="user-name">{{ currentUsername }}</div>
            <div class="user-status-text">{{ getStatusText(currentUserStatus) }}</div>
          </div>
        </div>

        <!-- 其他在线用户 -->
        <div 
          v-for="user in otherUsers" 
          :key="user.username"
          class="user-item"
        >
          <div class="user-avatar-container">
            <img 
              :src="user.avatar || defaultAvatar" 
              alt="用户头像" 
              class="user-avatar"
              @error="onAvatarError"
            />
            <div 
              class="status-indicator online"
              title="在线"
            ></div>
          </div>
          <div class="user-info">
            <div class="user-name">{{ user.username }}</div>
            <div class="user-status-text">在线</div>
          </div>
        </div>
      </div>

      <!-- 离线用户组 -->
      <div class="user-group">
        <div class="group-header">
          <span class="group-name">离线 — 0</span>
          <button class="group-collapse-button">
            <span class="icon">▼</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Discord风格的用户功能栏 -->
    <div class="user-controls">
      <!-- 当前用户信息 -->
      <div class="current-user-info" @click="handleAvatarClick">
        <div class="user-avatar-container">
          <img 
            :src="getCurrentUserAvatar()" 
            alt="当前用户头像" 
            class="user-avatar"
            @error="onAvatarError"
          />
          <div 
            :class="['status-indicator', currentUserStatus]"
            :title="getStatusText(currentUserStatus)"
          ></div>
        </div>
        <div class="user-details">
          <div class="user-name">{{ currentUsername }}</div>
          <div class="user-status">{{ getStatusText(currentUserStatus) }}</div>
        </div>
      </div>

      <!-- 功能按钮组 -->
      <div class="control-buttons">
        <button class="control-button" title="麦克风">
          <span class="icon">🎤</span>
        </button>
        <button class="control-button" title="耳机">
          <span class="icon">🎧</span>
        </button>
        <button class="control-button" title="设置" @click="handleAvatarClick">
          <span class="icon">⚙️</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { computed } from 'vue'

export default {
  name: 'OnlineUsersSidebar',
  props: {
    onlineUsers: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  emits: ['open-profile-editor'],
  setup(props, { emit }) {
    const store = useStore()
    const defaultAvatar = 'https://ui-avatars.com/api/?name=User&background=random'

    const currentUsername = computed(() => store.getters['userProfile/username'])
    const currentUserAvatar = computed(() => store.getters['userProfile/avatar'])
    const currentUserStatus = computed(() => store.getters['userProfile/status'])
    
    // 添加其他用户的计算属性
    const otherUsers = computed(() => 
      props.onlineUsers.filter(user => user.username !== currentUsername.value)
    )

    const getStatusText = (status) => {
      const statusMap = {
        online: '在线',
        away: '离开',
        busy: '请勿打扰',
        invisible: '隐身'
      }
      return statusMap[status] || '离线'
    }

    const getCurrentUserAvatar = () => {
      return currentUserAvatar.value || defaultAvatar
    }

    const onAvatarError = (e) => {
      e.target.src = defaultAvatar
    }

    // 添加处理头像点击的方法
    const handleAvatarClick = () => {
      emit('open-profile-editor')
    }

    return {
      currentUsername,
      currentUserStatus,
      defaultAvatar,
      getCurrentUserAvatar,
      onAvatarError,
      getStatusText,
      otherUsers,
      handleAvatarClick
    }
  }
}
</script>

<style scoped>
.online-users-sidebar {
  width: 240px;
  height: 100vh;
  background-color: var(--background-secondary);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  border-left: 1px solid var(--background-tertiary);
}

.channel-info {
  height: 48px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--background-tertiary);
  flex-shrink: 0;
}

.channel-name {
  color: var(--header-primary);
  font-size: 16px;
  font-weight: 600;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.channel-button {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  border-radius: 4px;
  color: var(--interactive-normal);
  cursor: pointer;
  transition: all 0.2s ease;
}

.channel-button:hover {
  color: var(--interactive-hover);
  background-color: var(--background-modifier-hover);
}

.users-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.user-group {
  margin-bottom: 16px;
}

.group-header {
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.group-name {
  color: var(--channels-default);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.group-collapse-button {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--interactive-normal);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.group-collapse-button:hover {
  color: var(--interactive-hover);
}

.group-collapse-button .icon {
  font-size: 10px;
}

.user-item {
  display: flex;
  align-items: center;
  padding: 6px 8px;
  margin: 1px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.user-item:hover {
  background-color: var(--background-modifier-hover);
}

.user-avatar-container {
  position: relative;
  width: 32px;
  height: 32px;
  margin-right: 12px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.status-indicator {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 3px solid var(--background-secondary);
  background-color: var(--offline-color);
}

.status-indicator.online {
  background-color: var(--online-color);
}

.status-indicator.away {
  background-color: var(--idle-color);
}

.status-indicator.busy {
  background-color: var(--dnd-color);
}

.status-indicator.invisible {
  background-color: var(--offline-color);
}

.user-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name {
  color: var(--header-primary);
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-status-text {
  color: var(--text-muted);
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 滚动条样式 */
.users-list::-webkit-scrollbar {
  width: 8px;
}

.users-list::-webkit-scrollbar-track {
  background-color: transparent;
  border-radius: 4px;
}

.users-list::-webkit-scrollbar-thumb {
  background-color: var(--background-tertiary);
  border-radius: 4px;
  min-height: 40px;
}

.users-list::-webkit-scrollbar-thumb:hover {
  background-color: var(--background-accent);
}

/* 响应式样式 */
@media (max-width: 768px) {
  .online-users-sidebar {
    position: fixed;
    right: 0;
    top: 0;
    z-index: 100;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  }

  .online-users-sidebar.show {
    transform: translateX(0);
  }
}

/* Discord风格的用户功能栏 */
.user-controls {
  height: 52px;
  padding: 0 8px;
  background-color: var(--background-tertiary);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--background-accent);
}

.current-user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  flex: 1;
}

.current-user-info:hover {
  background-color: var(--background-modifier-hover);
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--header-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-status {
  font-size: 12px;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.control-buttons {
  display: flex;
  align-items: center;
  gap: 4px;
}

.control-button {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--interactive-normal);
  cursor: pointer;
  transition: all 0.2s ease;
}

.control-button:hover {
  color: var(--interactive-hover);
  background-color: var(--background-modifier-hover);
}

.control-button .icon {
  font-size: 20px;
}

/* 响应式样式 */
@media (max-width: 768px) {
  .user-controls {
    padding: 0 4px;
  }

  .current-user-info {
    padding: 4px;
  }

  .user-details {
    display: none;
  }

  .control-button {
    width: 28px;
    height: 28px;
  }

  .control-button .icon {
    font-size: 18px;
  }
}
</style> 