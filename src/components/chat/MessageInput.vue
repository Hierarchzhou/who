<template>
  <div class="message-input-container">
    <!-- 表情按钮 -->
    <button @click="toggleStickerPicker" class="emoji-button" ref="emojiButton">
      🎯
    </button>
    
    <!-- 表情包选择器 -->
    <div v-if="showStickerPicker" class="sticker-picker-container" ref="stickerPicker">
      <StickerPicker @select="onStickerSelect" />
    </div>

    <textarea
      v-model="message"
      @keydown.enter.prevent="sendMessage"
      placeholder="输入消息..."
      class="message-input"
      ref="messageInput"
    ></textarea>
    <button @click="sendMessage" class="send-button">
      发送
    </button>
  </div>
</template>

<script>
import StickerPicker from './StickerPicker.vue'

export default {
  name: 'MessageInput',
  components: {
    StickerPicker
  },
  data() {
    return {
      message: '',  // 存储用户输入的消息
      showStickerPicker: false,  // 控制表情选择器的显示/隐藏
    }
  },
  methods: {
    // 发送消息
    sendMessage() {
      if (this.message.trim()) {
        this.$emit('send-message', this.message);
        this.message = '';
        this.$nextTick(() => {
          this.$refs.messageInput.focus();
        });
      }
    },
    // 切换表情选择器的显示/隐藏
    toggleStickerPicker(event) {
      event.stopPropagation();
      this.showStickerPicker = !this.showStickerPicker;
    },
    // 处理表情选择
    onStickerSelect(sticker) {
      // 发送带有表情包的消息
      this.$emit('send-message', `[sticker:${sticker.id}]`);
      this.showStickerPicker = false;
    },
    // 处理点击外部
    handleClickOutside(e) {
      if (this.showStickerPicker && 
          !this.$refs.stickerPicker?.contains(e.target) && 
          !this.$refs.emojiButton?.contains(e.target)) {
        this.showStickerPicker = false;
      }
    }
  },
  mounted() {
    this.$refs.messageInput.focus();
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  }
}
</script>

<style scoped>
.message-input-container {
  display: flex;
  padding: 1rem;
  background-color: var(--input-background); /* 使用主题变量 */
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 2;
}

.message-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-color: rgba(0, 0, 0, 0.2);
  color: var(--input-color); /* 使用主题变量 */
  font-size: 0.95rem;
  resize: none;
  height: 20px;
  line-height: 20px;
  transition: all 0.2s ease;
  margin-left: 0.5rem;
}

.message-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb, 138, 113, 88), 0.2);
}

.message-input::placeholder {
  color: var(--input-placeholder); /* 使用主题变量 */
  opacity: 0.7;
}

.send-button {
  margin-left: 0.75rem;
  padding: 0.5rem 1.25rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 1.5rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.send-button:hover {
  background-color: var(--secondary-color);
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.send-button:active {
  transform: translateY(0);
}

/* 修改表情选择器容器样式 */
.sticker-picker-container {
  position: absolute;
  bottom: 100%;
  left: 0;
  margin-bottom: 8px;
  width: 350px;
  background: var(--background-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

/* 表情按钮样式优化 */
.emoji-button {
  padding: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.2s ease;
  margin-right: 0.5rem;
}

.emoji-button:hover {
  transform: scale(1.1);
}

.emoji-button:focus {
  outline: none;
}
</style> 