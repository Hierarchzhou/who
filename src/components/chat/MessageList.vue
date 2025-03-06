<template>
  <div class="message-list" ref="messageList">
    <div v-if="messages.length === 0" class="welcome-message">
      <div class="welcome-header">
        <h2>欢迎来到 #general</h2>
        <p>这是聊天室的开始。</p>
      </div>
    </div>
    <div v-else class="messages-container">
      <div 
        v-for="(message, index) in messages" 
        :key="message.id || message.timestamp" 
        class="message-group"
        :class="{ 'first-message': isFirstMessage(message, index) }"
      >
        <!-- 日期分隔线 -->
        <div v-if="shouldShowDateDivider(message, index)" class="date-divider">
          <span class="date-text">{{ formatDate(message.timestamp) }}</span>
        </div>
        
        <!-- 消息内容 -->
        <div class="message-item" :class="{ 'compact': !isFirstInGroup(message, index) }">
          <div class="message-avatar" v-if="isFirstInGroup(message, index)">
            <img 
              :src="message.avatar || defaultAvatar" 
              :alt="message.sender" 
              class="avatar-img" 
              @error="handleAvatarError"
              @click="handleAvatarClick(message.sender)"
              :class="{ 'clickable': message.sender === currentUsername }"
            />
          </div>
          <div class="message-content">
            <div class="message-header" v-if="isFirstInGroup(message, index)">
              <span 
                class="username"
                :style="{ color: getUsernameColor(message.sender) }"
              >{{ message.sender }}</span>
              <span class="timestamp">{{ formatMessageTime(message.timestamp) }}</span>
            </div>
            <div class="message-body" :class="{ 'with-timestamp': !isFirstInGroup(message, index) }">
              <span v-if="!isFirstInGroup(message, index)" class="inline-timestamp">
                {{ formatMessageTime(message.timestamp) }}
              </span>
              <template v-if="isSticker(message.content)">
                <StickerMessage :sticker-id="extractStickerId(message.content)" />
              </template>
              <template v-else>
                <div class="message-text">{{ message.content }}</div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed, ref } from 'vue'
import { useStore } from 'vuex'
import StickerMessage from './StickerMessage.vue'
import { formatTimestamp } from '@/utils/time'

export default defineComponent({
  name: 'MessageList',
  components: {
    StickerMessage
  },
  props: {
    messages: {
      type: Array,
      default: () => []
    },
    currentUsername: {
      type: String,
      default: ''
    }
  },
  emits: ['open-profile-editor'],
  setup(props, { emit }) {
    const store = useStore()
    const defaultAvatar = 'https://api.dicebear.com/7.x/bottts/svg'
    const messageList = ref(null)
    
    // 获取当前状态，使用userProfile store
    const userStatus = computed(() => store.getters['userProfile/status'])

    const handleAvatarError = (event) => {
      event.target.src = defaultAvatar
    }

    const handleAvatarClick = (sender) => {
      if (sender === props.currentUsername) {
        emit('open-profile-editor')
      }
    }

    const isSticker = (content) => {
      return typeof content === 'string' && content.startsWith('[sticker:') && content.endsWith(']')
    }

    const extractStickerId = (content) => {
      if (!content) return null
      const match = content.match(/\[sticker:(.+?)\]/)
      return match ? match[1] : null
    }

    const scrollToBottom = () => {
      if (messageList.value) {
        messageList.value.scrollTop = messageList.value.scrollHeight
      }
    }

    // 生成一致的用户名颜色
    const getUsernameColor = (username) => {
      const colors = [
        '#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#e91e63',
        '#f1c40f', '#e67e22', '#e74c3c', '#95a5a6', '#607d8b'
      ]
      let hash = 0
      for (let i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + ((hash << 5) - hash)
      }
      return colors[Math.abs(hash) % colors.length]
    }

    // 检查是否是新的一天
    const shouldShowDateDivider = (message, index) => {
      if (index === 0) return true
      const prevMessage = props.messages[index - 1]
      const prevDate = new Date(prevMessage.timestamp).toLocaleDateString()
      const currentDate = new Date(message.timestamp).toLocaleDateString()
      return prevDate !== currentDate
    }

    // 格式化日期
    const formatDate = (timestamp) => {
      return new Date(timestamp).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    // 格式化消息时间
    const formatMessageTime = (timestamp) => {
      return new Date(timestamp).toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    // 检查是否是组中的第一条消息
    const isFirstInGroup = (message, index) => {
      if (index === 0) return true
      const prevMessage = props.messages[index - 1]
      const timeDiff = new Date(message.timestamp) - new Date(prevMessage.timestamp)
      return prevMessage.sender !== message.sender || timeDiff > 5 * 60 * 1000 // 5分钟间隔
    }

    // 检查是否是新的消息组
    const isFirstMessage = (message, index) => {
      return index === 0 || shouldShowDateDivider(message, index)
    }

    return {
      defaultAvatar,
      userStatus,
      handleAvatarError,
      handleAvatarClick,
      formatTime: formatTimestamp,
      isSticker,
      extractStickerId,
      scrollToBottom,
      messageList,
      getUsernameColor,
      shouldShowDateDivider,
      formatDate,
      formatMessageTime,
      isFirstInGroup,
      isFirstMessage
    }
  },
  watch: {
    messages: {
      handler() {
        this.scrollToBottom()
      },
      deep: true
    }
  },
  mounted() {
    this.scrollToBottom()
  }
})
</script>

<style scoped>
.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  background-color: var(--background-primary);
}

.welcome-message {
  padding: 48px 16px;
  text-align: center;
}

.welcome-header {
  margin-bottom: 16px;
}

.welcome-header h2 {
  color: var(--header-primary);
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
}

.welcome-header p {
  color: var(--text-normal);
  font-size: 16px;
}

.messages-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0 16px;
}

.message-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.date-divider {
  margin: 24px 0 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-divider::before,
.date-divider::after {
  content: '';
  height: 1px;
  flex: 1;
  background-color: var(--background-accent);
}

.date-text {
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  padding: 0 8px;
}

.message-item {
  display: flex;
  gap: 16px;
  padding: 2px 0;
  position: relative;
}

.message-item:hover {
  background-color: var(--background-secondary);
}

.message-item.compact {
  margin-left: 56px;
}

.message-avatar {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
}

.avatar-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.avatar-img:hover {
  opacity: 0.8;
}

.message-content {
  flex: 1;
  min-width: 0;
}

.message-header {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 4px;
}

.username {
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
}

.username:hover {
  text-decoration: underline;
}

.timestamp {
  color: var(--text-muted);
  font-size: 12px;
}

.message-body {
  color: var(--text-normal);
  font-size: 16px;
  line-height: 1.375;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.message-body.with-timestamp {
  display: flex;
  gap: 8px;
}

.inline-timestamp {
  color: var(--text-muted);
  font-size: 12px;
  margin-top: 3px;
  opacity: 0;
}

.message-item:hover .inline-timestamp {
  opacity: 1;
}

.message-text {
  flex: 1;
}

/* 响应式样式 */
@media (max-width: 768px) {
  .message-list {
    padding: 8px 0;
  }

  .messages-container {
    padding: 0 8px;
  }

  .message-item.compact {
    margin-left: 40px;
  }

  .message-avatar {
    width: 32px;
    height: 32px;
  }

  .avatar-img {
    width: 32px;
    height: 32px;
  }

  .username {
    font-size: 14px;
  }

  .message-body {
    font-size: 14px;
  }
}
</style> 