<template>
  <div class="status-selector">
    <button 
      v-for="status in statusOptions" 
      :key="status.value"
      :class="['status-btn', { active: currentStatus === status.value }]"
      @click="setStatus(status.value)"
    >
      <span class="status-icon" :class="status.value"></span>
      {{ status.label }}
    </button>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { computed } from 'vue'

export default {
  name: 'StatusSelector',
  setup() {
    const store = useStore()
    
    const statusOptions = [
      { value: 'online', label: '在线' },
      { value: 'away', label: '离开' },
      { value: 'busy', label: '勿扰' },
      { value: 'invisible', label: '隐身' }
    ]
    
    const currentStatus = computed(() => store.getters['userStatus/currentStatus'])
    
    const setStatus = (status) => {
      store.dispatch('userStatus/setStatus', status)
    }
    
    return {
      statusOptions,
      currentStatus,
      setStatus
    }
  }
}
</script>

<style scoped>
.status-selector {
  display: flex;
  gap: 8px;
  padding: 8px;
}

.status-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: #dcddde;
  cursor: pointer;
  transition: all 0.2s ease;
}

.status-btn:hover {
  background: rgba(255, 255, 255, 0.05);
}

.status-btn.active {
  background: rgba(255, 255, 255, 0.1);
}

.status-icon {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-icon.online {
  background-color: #43b581;
}

.status-icon.away {
  background-color: #faa61a;
}

.status-icon.busy {
  background-color: #f04747;
}

.status-icon.invisible {
  background-color: #747f8d;
}
</style> 