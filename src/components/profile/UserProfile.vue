<template>
  <div class="user-profile">
    <div class="profile-header">
      <h2>个人资料</h2>
      <button class="close-btn" @click="$emit('close')">&times;</button>
    </div>
    
    <div class="profile-content">
      <div class="avatar-section">
        <img :src="avatar" :alt="username" class="avatar" @error="handleAvatarError">
      </div>
      
      <div class="info-section">
        <div class="form-group">
          <label>用户名</label>
          <input type="text" v-model="username" placeholder="输入用户名">
        </div>
        
        <div class="form-group">
          <label>状态</label>
          <StatusSelector />
        </div>
        
        <div class="form-group">
          <label>个人介绍</label>
          <textarea v-model="bio" placeholder="介绍一下自己吧..."></textarea>
        </div>
      </div>
    </div>
    
    <div class="profile-footer">
      <button class="cancel-btn" @click="$emit('close')">取消</button>
      <button class="save-btn" @click="saveProfile">保存更改</button>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import StatusSelector from '../common/StatusSelector.vue'

export default {
  name: 'UserProfile',
  components: {
    StatusSelector
  },
  setup() {
    const store = useStore()
    const defaultAvatar = 'https://api.dicebear.com/7.x/bottts/svg'
    
    const username = ref('')
    const bio = ref('')
    const avatar = ref(defaultAvatar)
    
    const handleAvatarError = (e) => {
      e.target.src = defaultAvatar
    }
    
    const saveProfile = () => {
      // 保存用户资料的逻辑
      // TODO: 实现保存功能
    }
    
    return {
      username,
      bio,
      avatar,
      handleAvatarError,
      saveProfile
    }
  }
}
</script>

<style scoped>
.user-profile {
  background: #36393f;
  border-radius: 8px;
  width: 440px;
  max-width: 90vw;
  overflow: hidden;
}

.profile-header {
  padding: 16px 20px;
  background: #2f3136;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.profile-header h2 {
  margin: 0;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: #dcddde;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
}

.profile-content {
  padding: 20px;
}

.avatar-section {
  text-align: center;
  margin-bottom: 20px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  color: #dcddde;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

input, textarea {
  background: #40444b;
  border: none;
  border-radius: 4px;
  padding: 10px;
  color: #dcddde;
  font-size: 14px;
}

textarea {
  resize: vertical;
  min-height: 80px;
}

.profile-footer {
  padding: 16px 20px;
  background: #2f3136;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.cancel-btn, .save-btn {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn {
  background: transparent;
  border: 1px solid #dcddde;
  color: #dcddde;
}

.save-btn {
  background: #5865f2;
  border: none;
  color: #fff;
}

.save-btn:hover {
  background: #4752c4;
}

.cancel-btn:hover {
  background: rgba(255, 255, 255, 0.05);
}
</style> 