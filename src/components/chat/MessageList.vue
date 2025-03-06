<template>
  <div class="message-list" ref="messageList">
    <div v-if="messages.length === 0" class="no-messages">
      暂无消息，开始聊天吧！
    </div>
    <div v-else>
      <div 
        v-for="message in messages" 
        :key="message.id || message.timestamp" 
        class="message-item"
      >
        <div class="message-avatar">
          <img 
            :src="message.avatar || defaultAvatar" 
            :alt="message.username" 
            class="avatar-img" 
            @error="handleAvatarError"
            @click="handleAvatarClick(message.sender)"
            :class="{ 'clickable': message.sender === currentUsername }"
          />
          <div 
            v-if="message.sender === currentUsername"
            :class="['status-indicator', userStatus]"
          ></div>
          <div 
            v-else
            class="status-indicator online"
          ></div>
        </div>
        <div 
          class="message"
          :class="{ 'self': message.sender === currentUsername, 'other': message.sender !== currentUsername }"
        >
          <div class="message-header">
            <span class="username">{{ message.username }}</span>
            <span class="timestamp">{{ formatTime(message.timestamp) }}</span>
          </div>
          <div class="message-body">
            <template v-if="isSticker(message.content)">
              <StickerMessage :sticker-id="extractStickerId(message.content)" />
            </template>
            <template v-else>
              {{ message.content }}
            </template>
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

    return {
      defaultAvatar,
      userStatus,
      handleAvatarError,
      handleAvatarClick,
      formatTime: formatTimestamp,
      isSticker,
      extractStickerId,
      scrollToBottom,
      messageList
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
  padding: 1rem;
  display: flex;
  flex-direction: column;
  background-color: var(--chat-background); /* 使用主题变量 */
  position: relative;
}

.message-item {
  display: flex;
  margin-bottom: 1.5rem;
  align-items: flex-start;
}

.message-avatar {
  margin-right: 0.75rem;
  flex-shrink: 0;
  position: relative;
}

.avatar-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: var(--avatar-border, 2px solid rgba(255, 255, 255, 0.1));
  box-shadow: var(--avatar-shadow, 0 2px 4px rgba(0, 0, 0, 0.2));
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
  z-index: 1;
  background-color: #2f3136; /* Discord avatar background color */
}

.avatar-img:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* 添加状态指示器样式 */
.status-indicator {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: #747f8d;
  border: 2px solid var(--chat-background);
  z-index: 2;
  transition: background-color 0.2s ease;
}

.status-indicator.online {
  background-color: #43b581;
}

.status-indicator.away {
  background-color: #faa61a;
}

.status-indicator.busy {
  background-color: #f04747;
}

.status-indicator.invisible {
  background-color: #747f8d;
}

.status-indicator.online {
  background-color: #43b581;
}

.status-indicator.away {
  background-color: #faa61a;
}

.status-indicator.busy {
  background-color: #f04747;
}

.status-indicator.invisible {
  background-color: #747f8d;
}

.message-avatar::after {
  content: '';
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: var(--online-indicator);
  border-radius: 50%;
  bottom: 0;
  left: 0;
  border: 2px solid var(--chat-background);
  z-index: 2;
}

.message {
  max-width: 80%;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  position: relative;
  animation: fadeIn 0.3s ease-out;
  box-shadow: var(--message-shadow);
  transition: transform 0.2s ease;
  background-color: var(--other-message-bg); /* 使用主题变量 */
  color: var(--other-message-color); /* 使用主题变量 */
}

.message:hover {
  transform: translateY(-2px);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.message.self {
  background-color: var(--self-message-bg); /* 使用主题变量 */
  color: var(--self-message-color); /* 使用主题变量 */
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  opacity: 0.8;
}

.username {
  font-weight: bold;
}

.timestamp {
  font-size: 0.75rem;
  opacity: 0.7;
  margin-left: 0.75rem;
}

.message-body {
  word-break: break-word;
  line-height: 1.4;
}

.no-messages {
  text-align: center;
  color: var(--timestamp-color); /* 使用主题变量 */
  margin-top: 2rem;
  font-style: italic;
  opacity: 0.7;
}

/* 表情包消息样式 */
.message-body :deep(.sticker-message) {
  display: inline-block;
  margin: 0.25rem 0;
}

.avatar-img.clickable {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.avatar-img.clickable:hover {
  transform: scale(1.1);
}
</style> 