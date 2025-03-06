<template>
  <div class="online-users-container">
    <h3 class="online-title">在线用户 ({{ onlineUsers.length }})</h3>
    <div class="users-list">
      <div 
        v-for="user in onlineUsers" 
        :key="user.username"
        class="user-item"
        :class="{ 'current-user': user.username === currentUsername }"
      >
        <div class="user-avatar">
          <img :src="user.avatar || '/avatars/default.png'" alt="头像" class="avatar-img" />
          <span class="online-indicator"></span>
        </div>
        <span class="username">{{ user.username }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OnlineUsers',
  props: {
    onlineUsers: {
      type: Array,
      required: true
    },
    currentUsername: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.online-users-container {
  width: 240px;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.2);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.online-title {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color);
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.users-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.user-item {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s ease;
}

.user-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.user-item.current-user {
  background-color: rgba(var(--primary-color-rgb, 138, 113, 88), 0.1);
  border: 1px solid rgba(var(--primary-color-rgb, 138, 113, 88), 0.2);
}

.user-avatar {
  position: relative;
  margin-right: 0.75rem;
}

.avatar-img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.online-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--online-indicator);
  border: 1px solid rgba(0, 0, 0, 0.2);
}

.username {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .online-users-container {
    width: 180px;
  }
}

@media (max-width: 576px) {
  .online-users-container {
    display: none; /* 在小屏幕上隐藏在线用户列表 */
  }
}
</style> 