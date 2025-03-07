<template>
  <div class="modal-overlay" v-if="isOpen" @click.self="closeModal">
    <div class="modal-container">
      <!-- 模态框头部 -->
      <div class="modal-header">
        <h2>创建频道</h2>
        <button class="close-button" @click="closeModal">×</button>
      </div>

      <!-- 模态框内容 -->
      <div class="modal-content">
        <!-- 频道类型选择 -->
        <div class="channel-type-selector">
          <h3>频道类型</h3>
          <div class="type-options">
            <div 
              class="type-option" 
              :class="{ active: selectedType === 'text' }"
              @click="selectedType = 'text'"
            >
              <span class="type-icon">#</span>
              <div class="type-info">
                <h4>文字频道</h4>
                <p>发送消息、图片和文件</p>
              </div>
            </div>
            <div 
              class="type-option" 
              :class="{ active: selectedType === 'voice' }"
              @click="selectedType = 'voice'"
            >
              <span class="type-icon">🔊</span>
              <div class="type-info">
                <h4>语音频道</h4>
                <p>语音聊天和视频通话</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 频道设置 -->
        <div class="channel-settings">
          <div class="form-group">
            <label for="channelName">频道名称</label>
            <input 
              type="text" 
              id="channelName"
              v-model="channelName"
              placeholder="输入频道名称"
              class="input-field"
            />
          </div>

          <div class="form-group">
            <label for="channelTopic">频道主题（可选）</label>
            <input 
              type="text" 
              id="channelTopic"
              v-model="channelTopic"
              placeholder="输入频道主题"
              class="input-field"
            />
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                v-model="isPrivate"
              />
              <span>设为私密频道</span>
            </label>
            <p class="help-text">只有被邀请的成员才能访问此频道</p>
          </div>
        </div>
      </div>

      <!-- 模态框底部 -->
      <div class="modal-footer">
        <button class="cancel-button" @click="closeModal">取消</button>
        <button 
          class="create-button" 
          :disabled="!isValid"
          @click="createChannel"
        >
          创建频道
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CreateChannelModal',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      selectedType: 'text',  // 默认为文字频道
      channelName: '',
      channelTopic: '',
      isPrivate: false
    }
  },
  computed: {
    isValid() {
      return this.channelName.trim().length > 0
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    createChannel() {
      if (!this.isValid) return

      const channelData = {
        type: this.selectedType,
        name: this.channelName.trim(),
        topic: this.channelTopic.trim(),
        isPrivate: this.isPrivate
      }

      this.$emit('create', channelData)
      this.resetForm()
      this.closeModal()
    },
    resetForm() {
      this.selectedType = 'text'
      this.channelName = ''
      this.channelTopic = ''
      this.isPrivate = false
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background-color: var(--background-primary);
  border-radius: 8px;
  width: 480px;
  max-width: 90vw;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  padding: 16px 24px;
  border-bottom: 1px solid var(--background-tertiary);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  color: var(--header-primary);
  font-size: 1.25rem;
  font-weight: 600;
}

.close-button {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
}

.close-button:hover {
  color: var(--text-normal);
}

.modal-content {
  padding: 24px;
}

.channel-type-selector h3 {
  margin: 0 0 16px;
  color: var(--header-secondary);
  font-size: 1rem;
  font-weight: 600;
}

.type-options {
  display: grid;
  gap: 12px;
}

.type-option {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background-color: var(--background-secondary);
  border: 2px solid var(--background-tertiary);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.type-option:hover {
  background-color: var(--background-secondary-alt);
}

.type-option.active {
  border-color: var(--primary-color);
  background-color: var(--background-secondary-alt);
}

.type-icon {
  font-size: 24px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--background-tertiary);
  border-radius: 50%;
}

.type-info h4 {
  margin: 0 0 4px;
  color: var(--header-primary);
  font-size: 1rem;
  font-weight: 600;
}

.type-info p {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.875rem;
}

.channel-settings {
  margin-top: 24px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: var(--header-secondary);
  font-size: 0.875rem;
  font-weight: 600;
}

.input-field {
  width: 100%;
  padding: 10px;
  background-color: var(--background-tertiary);
  border: none;
  border-radius: 4px;
  color: var(--text-normal);
  font-size: 1rem;
}

.input-field:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--primary-color);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: var(--header-secondary);
  font-size: 0.875rem;
  font-weight: 600;
}

.help-text {
  margin: 4px 0 0 24px;
  color: var(--text-muted);
  font-size: 0.75rem;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--background-tertiary);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-button,
.create-button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-button {
  background-color: transparent;
  color: var(--text-normal);
}

.cancel-button:hover {
  background-color: var(--background-modifier-hover);
}

.create-button {
  background-color: var(--primary-color);
  color: white;
}

.create-button:hover {
  background-color: var(--primary-color-dark);
}

.create-button:disabled {
  background-color: var(--primary-color-disabled);
  cursor: not-allowed;
  opacity: 0.5;
}
</style> 