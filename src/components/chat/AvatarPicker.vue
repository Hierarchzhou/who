<template>
  <div class="avatar-picker-overlay" @click.self="close">
    <div class="avatar-picker-container">
      <!-- 头部 -->
      <div class="picker-header">
        <h3>选择头像</h3>
        <button class="close-button" @click="close">×</button>
      </div>

      <!-- 预览区域 -->
      <div class="preview-section">
        <div class="preview-container">
          <img 
            :src="previewAvatar || currentAvatar || getFallbackAvatarUrl()" 
            alt="头像"
            class="preview-image"
            @error="handleAvatarError"
          />
        </div>
        <p class="preview-hint">预览</p>
      </div>

      <!-- 样式选择器 -->
      <div class="style-selector">
        <div class="style-tabs">
          <button 
            v-for="category in categories" 
            :key="category.id"
            class="style-tab"
            :class="{ active: currentCategory === category.id }"
            @click="selectCategory(category.id)"
          >
            {{ category.name }}
          </button>
        </div>
      </div>

      <!-- 头像网格 -->
      <div class="avatar-grid" ref="gridContainer">
        <div 
          v-for="(avatar, index) in currentAvatars" 
          :key="index"
          class="avatar-option"
          :class="{ selected: previewAvatar === avatar }"
          @click="selectAvatar(avatar)"
        >
          <img :src="avatar" alt="头像" @error="handleAvatarError" />
        </div>

        <!-- 刷新按钮 - 仅在预设头像类别显示 -->
        <button 
          v-if="currentCategory === 'preset'"
          class="action-button refresh-button" 
          @click="regenerateAvatars"
        >
          换一批
        </button>

        <!-- 上传按钮 - 仅在自定义类别显示 -->
        <label 
          v-if="currentCategory === 'custom'"
          class="action-button upload-button" 
          for="avatar-upload"
        >
          上传图片
          <input
            type="file"
            id="avatar-upload"
            accept="image/*"
            @change="handleFileUpload"
            style="display: none"
          />
        </label>
      </div>

      <!-- 底部按钮 -->
      <div class="picker-footer">
        <button class="cancel-button" @click="close">取消</button>
        <button 
          class="confirm-button" 
          :disabled="!previewAvatar"
          @click="confirmSelection"
        >
          确认更改
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { getRandomDefaultAvatarUrl, getFallbackAvatarUrl, handleAvatarError } from '../../utils/avatarUtils';

export default {
  name: 'AvatarPicker',
  props: {
    currentAvatar: {
      type: String,
      default: ''
    }
  },
  setup(props, { emit }) {
    const currentCategory = ref('preset');
    const previewAvatar = ref('');
    const avatarSets = ref({
      preset: [],
      custom: []
    });

    // 定义头像类别
    const categories = [
      { id: 'preset', name: '头像' },
      { id: 'custom', name: '上传' }
    ];

    // 获取类别图标
    const getCategoryIcon = (categoryId) => {
      switch (categoryId) {
        case 'preset':
          return '头像';
        case 'custom':
          return '上传';
        default:
          return '头像';
      }
    };

    // 当前显示的头像列表
    const currentAvatars = computed(() => {
      return avatarSets.value[currentCategory.value] || [];
    });

    // 生成预设头像
    const generatePresetAvatars = () => {
      avatarSets.value.preset = Array(12).fill(null).map(() => getRandomDefaultAvatarUrl());
    };

    // 选择类别
    const selectCategory = (category) => {
      currentCategory.value = category;
      if (category === 'preset' && avatarSets.value.preset.length === 0) {
        generatePresetAvatars();
      }
    };

    // 选择头像
    const selectAvatar = (avatar) => {
      previewAvatar.value = avatar;
    };

    // 重新生成头像
    const regenerateAvatars = () => {
      if (currentCategory.value === 'preset') {
        generatePresetAvatars();
      }
    };

    // 处理文件上传
    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (!file) return;

      if (!file.type.match('image.*')) {
        alert('请上传图片文件');
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        alert('图片大小不能超过 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const avatar = e.target.result;
        avatarSets.value.custom = [avatar, ...avatarSets.value.custom];
        currentCategory.value = 'custom';
        previewAvatar.value = avatar;
      };
      reader.readAsDataURL(file);
    };

    // 确认选择
    const confirmSelection = () => {
      if (previewAvatar.value) {
        emit('select', previewAvatar.value);
        close();
      }
    };

    // 关闭选择器
    const close = () => {
      emit('close');
    };

    // 初始化
    generatePresetAvatars();

    return {
      currentCategory,
      previewAvatar,
      categories,
      currentAvatars,
      selectCategory,
      selectAvatar,
      regenerateAvatars,
      handleFileUpload,
      confirmSelection,
      close,
      getFallbackAvatarUrl,
      handleAvatarError,
      getCategoryIcon
    };
  }
}
</script>

<style scoped>
.avatar-picker-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
  backdrop-filter: blur(8px);
}

.avatar-picker-container {
  width: 90%;
  max-width: 480px;
  background: var(--chat-background);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.picker-header {
  padding: 16px 20px;
  background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.picker-header h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.close-button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.preview-section {
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
}

.preview-container {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
  padding: 3px;
  margin-bottom: 12px;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  background: var(--chat-background);
}

.preview-hint {
  color: var(--text-color);
  font-size: 0.9rem;
  opacity: 0.7;
  margin: 0;
}

.style-selector {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
}

.style-tabs {
  display: flex;
  gap: 12px;
}

.style-tab {
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  background: var(--input-background);
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.style-tab:hover { background: var(--hover-color); }
.style-tab.active { background: var(--primary-color); color: white; }

.avatar-grid {
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 12px;
  max-height: 300px;
  overflow-y: auto;
}

.avatar-option {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
}

.avatar-option img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-option:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.avatar-option.selected {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border: 2px solid var(--primary-color);
}

.action-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border: 2px dashed var(--border-color);
  border-radius: 12px;
  background: transparent;
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.8rem;
}

.action-button:hover {
  background: var(--hover-color);
  border-style: solid;
}

.picker-footer {
  padding: 16px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background: var(--input-background);
  border-top: 1px solid var(--border-color);
}

.cancel-button, .confirm-button {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-button {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-color);
}

.cancel-button:hover { background: var(--hover-color); }

.confirm-button {
  background: var(--primary-color);
  border: none;
  color: white;
}

.confirm-button:hover:not(:disabled) {
  background: var(--secondary-color);
  transform: translateY(-1px);
}

.confirm-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 480px) {
  .avatar-picker-container {
    width: 100%;
    height: 100%;
    border-radius: 0;
  }

  .preview-section { padding: 16px; }

  .avatar-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    padding: 16px;
  }

  .style-tabs {
    overflow-x: auto;
    padding-bottom: 8px;
  }

  .style-tab { white-space: nowrap; }
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.current-avatar-wrapper:hover .avatar-overlay {
  opacity: 1;
}

.change-text {
  color: white;
  font-size: 14px;
}
</style> 