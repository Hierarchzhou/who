<template>
  <div class="user-status" :class="currentStatus">
    <span class="status-dot"></span>
    <span class="status-text">{{ statusText }}</span>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'UserStatus',
  setup() {
    const store = useStore()
    
    const currentStatus = computed(() => store.getters['userStatus/currentStatus'])
    
    const statusText = computed(() => {
      switch (currentStatus.value) {
        case 'online': return '在线'
        case 'away': return '离开'
        case 'busy': return '勿扰'
        case 'invisible': return '隐身'
        default: return '离线'
      }
    })
    
    return {
      currentStatus,
      statusText
    }
  }
}
</script>

<style scoped>
.user-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #dcddde;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #747f8d;
}

.online .status-dot {
  background-color: #43b581;
}

.away .status-dot {
  background-color: #faa61a;
}

.busy .status-dot {
  background-color: #f04747;
}

.invisible .status-dot {
  background-color: #747f8d;
}

.status-text {
  font-size: 12px;
  opacity: 0.8;
}
</style> 