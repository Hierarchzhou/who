<template>
  <div class="profile-editor-overlay" v-if="isOpen" @click.self="closeEditor">
    <div class="profile-editor-container">
      <!-- 头部 -->
      <div class="profile-editor-header">
        <h2>个人资料</h2>
        <button class="close-button" @click="closeEditor">
          <span class="close-icon">×</span>
        </button>
      </div>
      
      <!-- 主要内容区域 -->
      <div class="profile-editor-content">
        <!-- 头像编辑区域 -->
        <div class="avatar-section">
          <div class="current-avatar-wrapper" @click="openAvatarPicker">
            <img :src="currentAvatar" alt="用户头像" class="current-avatar" />
            <div class="avatar-overlay">
              <span class="change-text">更换头像</span>
            </div>
          </div>
        </div>

        <!-- 用户信息编辑区域 -->
        <div class="user-info-section">
          <div class="form-group">
            <label for="username">
              用户名
            </label>
            <input 
              type="text" 
              id="username" 
              v-model="username" 
              placeholder="设置你的用户名"
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <label for="status">
              状态
            </label>
            <div class="status-selector">
              <button 
                v-for="(status, key) in statusOptions" 
                :key="key"
                class="status-option"
                :class="{ active: currentStatus === key }"
                @click="selectStatus(key)"
              >
                <span class="status-icon" :class="key"></span>
                <span class="status-text">{{ status }}</span>
              </button>
            </div>
          </div>
          
          <div class="form-group">
            <label for="bio">
              个人简介
            </label>
            <textarea 
              id="bio" 
              v-model="bio" 
              placeholder="介绍一下自己吧..."
              class="form-input bio-input"
              rows="3"
            ></textarea>
          </div>
        </div>
      </div>
      
      <!-- 底部按钮 -->
      <div class="profile-editor-footer">
        <button class="cancel-button" @click="closeEditor">
          取消
        </button>
        <button class="save-button" @click="saveProfile">
          确认更改
        </button>
      </div>
    </div>

    <!-- 头像选择器 -->
    <AvatarPicker
      v-if="showAvatarPicker"
      :currentAvatar="currentAvatar"
      @close="closeAvatarPicker"
      @select="handleAvatarSelected"
    />
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { getFallbackAvatarUrl } from '../../utils/avatarUtils';
import AvatarPicker from './AvatarPicker.vue';
import { useStore } from 'vuex';

export default {
  name: 'UserProfileEditor',
  components: { AvatarPicker },
  props: {
    isOpen: Boolean
  },
  setup(props, { emit }) {
    const store = useStore();
    
    // 从store获取用户信息
    const username = ref(store.getters['userProfile/username'] || '');
    const currentAvatar = ref(store.getters['userProfile/avatar'] || '');
    const currentStatus = ref(store.getters['userProfile/status'] || 'online');
    const bio = ref(store.getters['userProfile/bio'] || '');
    const showAvatarPicker = ref(false);
    
    const statusOptions = {
      online: '在线',
      away: '离开',
      busy: '请勿打扰',
      invisible: '隐身'
    };

    // 监听store中的用户信息变化
    watch(() => store.getters['userProfile/profile'], (newValue) => {
      username.value = newValue.username || '';
      currentAvatar.value = newValue.avatar || '';
      currentStatus.value = newValue.status || 'online';
      bio.value = newValue.bio || '';
    }, { deep: true });

    const openAvatarPicker = () => showAvatarPicker.value = true;
    const closeAvatarPicker = () => showAvatarPicker.value = false;
    const handleAvatarSelected = (avatar) => currentAvatar.value = avatar;
    const selectStatus = (status) => currentStatus.value = status;

    const saveProfile = () => {
      const updatedProfile = {
        username: username.value,
        avatar: currentAvatar.value,
        status: currentStatus.value,
        bio: bio.value
      };
      
      // 更新store中的用户信息
      store.dispatch('userProfile/updateProfile', updatedProfile);
      emit('update-profile', updatedProfile);
      emit('close');
    };

    return {
      username,
      currentAvatar,
      currentStatus,
      bio,
      statusOptions,
      showAvatarPicker,
      selectStatus,
      saveProfile,
      closeEditor: () => emit('close'),
      openAvatarPicker,
      closeAvatarPicker,
      handleAvatarSelected,
      getFallbackAvatarUrl
    };
  }
}
</script>

<style scoped>
.profile-editor-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
}

.profile-editor-container {
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

.profile-editor-header {
  padding: 20px;
  background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.profile-editor-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.close-button {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.close-button:hover { background-color: rgba(255, 255, 255, 0.2); }

.profile-editor-content { padding: 24px; }

.avatar-section {
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
}

.current-avatar-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
  padding: 3px;
}

.current-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  background: var(--chat-background);
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

.current-avatar-wrapper:hover .avatar-overlay { opacity: 1; }

.change-text {
  color: white;
  font-size: 14px;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: var(--text-color);
  font-weight: 500;
}

.form-group .material-icons {
  font-size: 20px;
  color: var(--primary-color);
}

.form-input {
  width: 100%;
  padding: 12px;
  background: var(--input-background);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-color);
  font-size: 14px;
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.2);
}

.bio-input {
  resize: vertical;
  min-height: 80px;
}

.status-selector {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 8px;
}

.status-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--input-background);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.status-option:hover { background: var(--hover-color); }

.status-option.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.status-icon {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-icon.online { background-color: #43b581; }
.status-icon.away { background-color: #faa61a; }
.status-icon.busy { background-color: #f04747; }
.status-icon.invisible { background-color: #747f8d; }

.profile-editor-footer {
  padding: 16px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background: var(--input-background);
  border-top: 1px solid var(--border-color);
}

.cancel-button, .save-button {
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

.save-button {
  background: var(--primary-color);
  border: none;
  color: white;
}

.save-button:hover {
  background: var(--secondary-color);
  transform: translateY(-1px);
}

.material-icons {
  font-size: 18px;
}

@media (max-width: 480px) {
  .profile-editor-container {
    width: 100%;
    height: 100%;
    border-radius: 0;
  }
}
</style> 