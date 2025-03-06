<template>
  <div class="message-input-container">
    <div class="input-wrapper">
      <!-- 上传按钮 -->
      <button class="action-button" title="上传文件">
        <span class="icon">➕</span>
      </button>

      <!-- 输入框 -->
      <div class="textarea-wrapper">
        <textarea
          v-model="message"
          @keydown.enter.prevent="sendMessage"
          :placeholder="placeholder"
          class="message-input"
          ref="messageInput"
          rows="1"
          @input="autoResize"
        ></textarea>
      </div>

      <!-- 右侧按钮组 -->
      <div class="input-actions">
        <!-- 表情按钮 -->
        <button 
          @click="toggleStickerPicker" 
          class="action-button"
          ref="emojiButton"
          title="选择表情"
        >
          <span class="icon">😊</span>
        </button>

        <!-- 礼物按钮 -->
        <button class="action-button" title="发送礼物">
          <span class="icon">🎁</span>
        </button>

        <!-- GIF按钮 -->
        <button class="action-button" title="选择 GIF">
          <span class="icon">GIF</span>
        </button>

        <!-- 发送按钮，仅在有内容时显示 -->
        <button 
          v-if="message.trim()"
          @click="sendMessage" 
          class="action-button send-button"
          title="发送消息"
        >
          <span class="icon">📨</span>
        </button>
      </div>
    </div>

    <!-- 表情包选择器 -->
    <div 
      v-if="showStickerPicker" 
      class="sticker-picker-container" 
      ref="stickerPicker"
    >
      <StickerPicker @select="onStickerSelect" />
    </div>
  </div>
</template>

<script>
import StickerPicker from './StickerPicker.vue'

export default {
  name: 'MessageInput',
  components: {
    StickerPicker
  },
  props: {
    placeholder: {
      type: String,
      default: '发送消息...'
    }
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
          this.autoResize();
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
    },
    // 自动调整文本框高度
    autoResize() {
      const textarea = this.$refs.messageInput;
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
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
  padding: 0 16px 24px;
  background-color: var(--background-primary);
  position: relative;
}

.input-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  padding: 0 16px;
  background-color: var(--background-secondary);
  border-radius: 8px;
  min-height: 44px;
}

.textarea-wrapper {
  flex: 1;
  min-height: 44px;
  display: flex;
  align-items: center;
}

.message-input {
  width: 100%;
  max-height: 50vh;
  padding: 11px 0;
  border: none;
  background: transparent;
  color: var(--text-normal);
  font-family: inherit;
  font-size: 16px;
  line-height: 1.375;
  resize: none;
}

.message-input:focus {
  outline: none;
}

.message-input::placeholder {
  color: var(--text-muted);
}

.input-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 0;
}

.action-button {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  color: var(--interactive-normal);
  transition: all 0.2s ease;
}

.action-button:hover {
  color: var(--interactive-hover);
  background-color: var(--background-accent);
}

.action-button .icon {
  font-size: 20px;
}

.send-button {
  color: var(--primary-color);
}

.send-button:hover {
  color: var(--text-normal);
  background-color: var(--primary-color);
}

/* 表情选择器容器 */
.sticker-picker-container {
  position: absolute;
  bottom: 100%;
  right: 16px;
  margin-bottom: 8px;
  width: 400px;
  height: 400px;
  background: var(--background-primary);
  border-radius: 8px;
  box-shadow: var(--elevation-stroke),
              var(--elevation-high);
  z-index: 1000;
}

/* 响应式样式 */
@media (max-width: 768px) {
  .message-input-container {
    padding: 0 8px 16px;
  }

  .input-wrapper {
    padding: 0 8px;
  }

  .action-button {
    width: 28px;
    height: 28px;
  }

  .action-button .icon {
    font-size: 18px;
  }

  .message-input {
    font-size: 14px;
  }
}
</style> 