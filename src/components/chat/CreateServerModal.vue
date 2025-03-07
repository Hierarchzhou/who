<template>
  <div v-if="isOpen" class="create-server-modal">
    <div class="modal-overlay" @click="closeModal"></div>
    <div class="modal-content">
      <!-- 步骤指示器 -->
      <div class="step-indicator">
        <div class="step-dots">
          <div 
            v-for="step in 3" 
            :key="step"
            class="step-dot"
            :class="{ active: currentStep === step }"
          ></div>
        </div>
        <span class="step-text">第 {{ currentStep }}/3 步</span>
      </div>

      <!-- 第一步：选择服务器类型 -->
      <div v-if="currentStep === 1" class="step-content">
        <h2>创建服务器</h2>
        <p class="step-description">选择一个类型，让我们帮你设置服务器</p>
        
        <div class="server-types">
          <div 
            v-for="type in serverTypes" 
            :key="type.id"
            class="type-option"
            :class="{ selected: selectedType === type.id }"
            @click="selectedType = type.id"
          >
            <div class="type-icon">{{ type.icon }}</div>
            <div class="type-info">
              <h3>{{ type.name }}</h3>
              <p>{{ type.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 第二步：选择兴趣标签 -->
      <div v-if="currentStep === 2" class="step-content">
        <h2>选择服务器兴趣</h2>
        <p class="step-description">选择一些兴趣标签，帮助其他人了解你的服务器</p>
        
        <div class="interests-grid">
          <div 
            v-for="interest in interests" 
            :key="interest.id"
            class="interest-tag"
            :class="{ selected: selectedInterests.includes(interest.id) }"
            @click="toggleInterest(interest.id)"
          >
            <span class="interest-icon">{{ interest.icon }}</span>
            {{ interest.name }}
          </div>
        </div>
      </div>

      <!-- 第三步：设置服务器详情 -->
      <div v-if="currentStep === 3" class="step-content">
        <h2>自定义你的服务器</h2>
        <p class="step-description">给你的服务器一个身份</p>
        
        <div class="form-group">
          <label>服务器名称</label>
          <input 
            v-model="serverName" 
            type="text" 
            placeholder="输入服务器名称"
            class="form-input"
          >
        </div>
        
        <div class="form-group">
          <label>服务器图标（可选）</label>
          <div class="server-icon-upload" @click="triggerFileInput">
            <img 
              v-if="serverIcon" 
              :src="serverIcon" 
              alt="服务器图标"
              class="server-icon-preview"
            >
            <div v-else class="upload-placeholder">
              <span class="upload-icon">+</span>
              <span>上传图标</span>
            </div>
          </div>
          <input 
            type="file" 
            ref="fileInput"
            accept="image/*"
            class="hidden"
            @change="handleIconUpload"
          >
        </div>
      </div>

      <!-- 导航按钮 -->
      <div class="modal-actions">
        <button 
          v-if="currentStep > 1" 
          class="back-button"
          @click="currentStep--"
        >
          返回
        </button>
        
        <button 
          v-if="currentStep < 3" 
          class="next-button"
          :disabled="!canProceed"
          @click="currentStep++"
        >
          继续
        </button>
        
        <button 
          v-else 
          class="create-button"
          :disabled="!canCreate"
          @click="createServer"
        >
          创建服务器
        </button>
      </div>

      <button class="close-button" @click="closeModal">×</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CreateServerModal',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentStep: 1,
      selectedType: '',
      selectedInterests: [],
      serverName: '',
      serverIcon: null,
      // 服务器类型选项
      serverTypes: [
        {
          id: 'gaming',
          name: '游戏社区',
          description: '创建一个游戏玩家的交流社区',
          icon: '🎮'
        },
        {
          id: 'study',
          name: '学习小组',
          description: '创建一个学习交流的空间',
          icon: '📚'
        },
        {
          id: 'social',
          name: '社交聊天',
          description: '创建一个朋友间的聊天空间',
          icon: '💬'
        },
        {
          id: 'other',
          name: '其他',
          description: '创建一个自定义类型的服务器',
          icon: '🌟'
        }
      ],
      // 兴趣标签选项
      interests: [
        { id: 'games', name: '游戏', icon: '🎮' },
        { id: 'music', name: '音乐', icon: '🎵' },
        { id: 'art', name: '艺术', icon: '🎨' },
        { id: 'tech', name: '科技', icon: '💻' },
        { id: 'sports', name: '运动', icon: '⚽' },
        { id: 'food', name: '美食', icon: '🍜' },
        { id: 'travel', name: '旅行', icon: '✈️' },
        { id: 'movies', name: '电影', icon: '🎬' },
        { id: 'books', name: '读书', icon: '📚' },
        { id: 'pets', name: '宠物', icon: '🐱' },
        { id: 'fashion', name: '时尚', icon: '👗' },
        { id: 'education', name: '教育', icon: '📖' }
      ]
    }
  },
  computed: {
    // 判断是否可以进行下一步
    canProceed() {
      switch (this.currentStep) {
        case 1:
          return !!this.selectedType
        case 2:
          return this.selectedInterests.length > 0
        default:
          return true
      }
    },
    // 判断是否可以创建服务器
    canCreate() {
      return this.serverName.trim().length > 0
    }
  },
  methods: {
    // 关闭模态框
    closeModal() {
      this.$emit('close')
      this.resetForm()
    },
    
    // 切换兴趣标签的选中状态
    toggleInterest(interestId) {
      const index = this.selectedInterests.indexOf(interestId)
      if (index === -1) {
        if (this.selectedInterests.length < 5) { // 最多选择5个兴趣
          this.selectedInterests.push(interestId)
        }
      } else {
        this.selectedInterests.splice(index, 1)
      }
    },
    
    // 触发文件选择
    triggerFileInput() {
      this.$refs.fileInput.click()
    },
    
    // 处理图标上传
    async handleIconUpload(event) {
      const file = event.target.files[0]
      if (file) {
        try {
          const reader = new FileReader()
          reader.onload = (e) => {
            this.serverIcon = e.target.result
          }
          reader.readAsDataURL(file)
        } catch (error) {
          console.error('图标上传失败:', error)
        }
      }
    },
    
    // 创建服务器
    createServer() {
      const serverData = {
        name: this.serverName,
        type: this.selectedType,
        interests: this.selectedInterests,
        icon: this.serverIcon
      }
      
      this.$emit('create', serverData)
      this.closeModal()
    },
    
    // 重置表单
    resetForm() {
      this.currentStep = 1
      this.selectedType = ''
      this.selectedInterests = []
      this.serverName = ''
      this.serverIcon = null
    }
  }
}
</script>

<style scoped>
.create-server-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
}

.modal-content {
  position: relative;
  width: 90%;
  max-width: 480px;
  background: var(--background-primary);
  border-radius: 8px;
  padding: 24px;
  z-index: 1;
}

.step-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
}

.step-dots {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.step-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--background-accent);
  transition: all 0.3s ease;
}

.step-dot.active {
  background-color: var(--primary-color);
  transform: scale(1.2);
}

.step-text {
  font-size: 14px;
  color: var(--text-muted);
}

.step-content {
  text-align: center;
  margin-bottom: 24px;
}

.step-content h2 {
  font-size: 24px;
  font-weight: 700;
  color: var(--header-primary);
  margin-bottom: 8px;
}

.step-description {
  color: var(--text-muted);
  margin-bottom: 24px;
}

.server-types {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.type-option {
  display: flex;
  align-items: center;
  padding: 16px;
  background: var(--background-secondary);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.type-option:hover {
  background: var(--background-modifier-hover);
}

.type-option.selected {
  background: var(--primary-color);
  color: white;
}

.type-icon {
  font-size: 24px;
  margin-right: 16px;
}

.type-info h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.type-info p {
  font-size: 14px;
  color: var(--text-muted);
}

.interests-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.interest-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--background-secondary);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.interest-tag:hover {
  background: var(--background-modifier-hover);
}

.interest-tag.selected {
  background: var(--primary-color);
  color: white;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: var(--header-secondary);
  font-weight: 600;
}

.form-input {
  width: 100%;
  padding: 10px;
  background: var(--background-secondary);
  border: none;
  border-radius: 4px;
  color: var(--text-normal);
}

.server-icon-upload {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: var(--background-secondary);
  cursor: pointer;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.server-icon-upload:hover {
  background: var(--background-modifier-hover);
}

.server-icon-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: var(--text-muted);
}

.upload-icon {
  font-size: 24px;
}

.hidden {
  display: none;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
}

.back-button,
.next-button,
.create-button {
  padding: 10px 20px;
  border-radius: 4px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.back-button {
  background: var(--background-secondary);
  color: var(--text-normal);
}

.next-button,
.create-button {
  background: var(--primary-color);
  color: white;
}

.back-button:hover {
  background: var(--background-modifier-hover);
}

.next-button:hover,
.create-button:hover {
  background: var(--primary-color-dark);
}

.next-button:disabled,
.create-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.close-button {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-button:hover {
  background: var(--background-modifier-hover);
  color: var(--text-normal);
}
</style> 