<template>
  <div class="avatar-selector">
    <!-- 头像预览区域 -->
    <div class="avatar-preview" @click="triggerFileInput">
      <div v-if="previewUrl" class="avatar-preview-container">
        <img :src="previewUrl" alt="Avatar preview" class="preview-image" />
        <div class="avatar-hover-effect">
          <span class="change-text">更换头像</span>
        </div>
      </div>
      <div v-else class="empty-preview">
        <div class="default-avatar">
          <img :src="getRandomDefaultAvatarUrl()" alt="Default avatar" />
        </div>
        <span>点击选择头像</span>
      </div>
    </div>

    <!-- 头像样式选择器 -->
    <div class="style-selector">
      <div class="style-categories">
        <button 
          v-for="style in avatarStyles" 
          :key="style"
          class="style-button"
          :class="{ active: selectedStyle === style }"
          @click="selectStyle(style)"
        >
          {{ getStyleName(style) }}
        </button>
      </div>
    </div>

    <!-- 头像网格 -->
    <div class="avatar-grid">
      <div 
        v-for="(avatar, index) in generatedAvatars" 
        :key="index"
        class="avatar-option"
        :class="{ selected: selectedAvatar === avatar }"
        @click="selectAvatar(avatar)"
      >
        <img :src="avatar" alt="Avatar option" />
        <div class="hover-effect">
          <span class="select-text">选择</span>
        </div>
      </div>
      
      <!-- 刷新按钮 -->
      <div class="avatar-option refresh-option" @click="regenerateAvatars">
        <div class="refresh-icon">
          <span>↻</span>
          <span class="refresh-text">换一批</span>
        </div>
      </div>
      
      <!-- 自定义上传选项 -->
      <div class="avatar-option upload-option">
        <label for="avatar-upload" class="upload-label">
          <div class="upload-icon">
            <span>+</span>
            <span class="upload-text">上传图片</span>
          </div>
        </label>
        <input 
          type="file" 
          id="avatar-upload" 
          @change="handleFileSelect" 
          accept="image/*"
          style="display: none"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getRandomDefaultAvatarUrl, avatarStyles } from '../../utils/avatarUtils';

export default {
  name: 'AvatarSelector',
  data() {
    return {
      selectedStyle: avatarStyles[0],
      selectedAvatar: '',
      previewUrl: null,
      generatedAvatars: [],
      avatarStyles
    }
  },
  created() {
    this.generateAvatarSet();
  },
  methods: {
    // 生成一组头像
    generateAvatarSet() {
      this.generatedAvatars = Array(8).fill(null).map(() => getRandomDefaultAvatarUrl());
    },
    
    // 选择头像样式
    selectStyle(style) {
      this.selectedStyle = style;
      this.generateAvatarSet();
    },
    
    // 获取样式名称的中文显示
    getStyleName(style) {
      const styleNames = {
        'micah': '简约',
        'avataaars': '卡通',
        'bottts': '机器人',
        'personas': '像素',
        'thumbs': '拇指',
        'lorelei': '可爱',
        'notionists': '商务',
        'adventurer': '冒险',
        'fun-emoji': '表情',
        'big-smile': '微笑'
      };
      return styleNames[style] || style;
    },
    
    // 选择头像
    selectAvatar(avatar) {
      this.selectedAvatar = avatar;
      this.previewUrl = avatar;
      this.$emit('avatar-selected', avatar);
    },
    
    // 重新生成头像
    regenerateAvatars() {
      this.generateAvatarSet();
    },
    
    // 处理文件选择
    handleFileSelect(event) {
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
        this.previewUrl = e.target.result;
        this.selectedAvatar = e.target.result;
        this.$emit('avatar-selected', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }
}
</script>

<style scoped>
.avatar-selector {
  width: 100%;
  max-width: 600px;
  padding: 1.5rem;
  background: var(--chat-background);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.avatar-preview {
  width: 120px;
  height: 120px;
  margin: 0 auto 2rem;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
  padding: 3px;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.avatar-hover-effect, .hover-effect {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.avatar-preview:hover .avatar-hover-effect,
.avatar-option:hover .hover-effect {
  opacity: 1;
}

.change-text, .select-text {
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
}

.style-selector {
  margin-bottom: 2rem;
}

.style-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.style-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 20px;
  background: var(--input-background);
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.style-button.active {
  background: var(--primary-color);
  color: white;
  transform: scale(1.05);
}

.avatar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 1rem;
  padding: 1rem;
  background: var(--input-background);
  border-radius: 8px;
}

.avatar-option {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  border: 3px solid transparent;
}

.avatar-option img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-option.selected {
  border-color: var(--primary-color);
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.refresh-option, .upload-option {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--chat-background);
  border: 2px dashed var(--border-color);
}

.refresh-icon, .upload-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--text-color);
  font-size: 1.5rem;
}

.refresh-text, .upload-text {
  font-size: 0.8rem;
  margin-top: 0.3rem;
}

.empty-preview {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--input-background);
  border-radius: 50%;
}

.default-avatar {
  width: 80%;
  height: 80%;
  border-radius: 50%;
  overflow: hidden;
}

.default-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (max-width: 480px) {
  .avatar-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .style-button {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
}
</style> 