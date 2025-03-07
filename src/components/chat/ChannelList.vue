<template>
  <div class="channel-list">
    <!-- 频道分类 -->
    <div class="channel-category" v-for="category in categories" :key="category.id">
      <div class="category-header" @click="toggleCategory(category.id)">
        <span class="category-arrow" :class="{ expanded: expandedCategories.includes(category.id) }">
          ▶
        </span>
        <span class="category-name">{{ category.name }}</span>
        <button 
          v-if="category.canCreateChannel" 
          class="add-channel-button"
          @click.stop="openCreateChannel"
          title="创建频道"
        >
          +
        </button>
      </div>

      <!-- 频道列表 -->
      <div class="channels" v-show="expandedCategories.includes(category.id)">
        <div 
          v-for="channel in category.channels" 
          :key="channel.id"
          class="channel-item"
          :class="{ 
            active: currentChannelId === channel.id,
            unread: channel.hasUnread
          }"
          @click="selectChannel(channel)"
        >
          <!-- 频道图标 -->
          <span class="channel-icon">
            {{ channel.type === 'voice' ? '🔊' : '#' }}
          </span>

          <!-- 频道名称 -->
          <span class="channel-name">{{ channel.name }}</span>

          <!-- 频道操作按钮 -->
          <div class="channel-actions" v-if="currentChannelId === channel.id">
            <button 
              class="action-button"
              title="邀请成员"
              @click.stop="inviteToChannel(channel)"
            >
              👥
            </button>
            <button 
              class="action-button"
              title="频道设置"
              @click.stop="openChannelSettings(channel)"
            >
              ⚙️
            </button>
          </div>

          <!-- 未读消息提示 -->
          <span class="unread-indicator" v-if="channel.hasUnread">
            {{ channel.unreadCount > 99 ? '99+' : channel.unreadCount }}
          </span>
        </div>
      </div>
    </div>

    <!-- 创建频道模态框 -->
    <CreateChannelModal
      :isOpen="showCreateChannel"
      @close="closeCreateChannel"
      @create="handleChannelCreate"
    />
  </div>
</template>

<script>
import CreateChannelModal from './CreateChannelModal.vue'

export default {
  name: 'ChannelList',
  components: {
    CreateChannelModal
  },
  props: {
    currentChannelId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      expandedCategories: ['text', 'voice'],  // 默认展开的分类
      showCreateChannel: false,
      categories: [
        {
          id: 'text',
          name: '文字频道',
          canCreateChannel: true,
          channels: [
            { id: 'general', name: '综合讨论', type: 'text', hasUnread: false },
            { id: 'announcement', name: '公告', type: 'text', hasUnread: true, unreadCount: 3 }
          ]
        },
        {
          id: 'voice',
          name: '语音频道',
          canCreateChannel: true,
          channels: [
            { id: 'voice-general', name: '语音大厅', type: 'voice', hasUnread: false },
            { id: 'gaming', name: '游戏频道', type: 'voice', hasUnread: false }
          ]
        }
      ]
    }
  },
  methods: {
    // 切换分类展开/折叠
    toggleCategory(categoryId) {
      const index = this.expandedCategories.indexOf(categoryId)
      if (index === -1) {
        this.expandedCategories.push(categoryId)
      } else {
        this.expandedCategories.splice(index, 1)
      }
    },

    // 选择频道
    selectChannel(channel) {
      this.$emit('select-channel', channel)
    },

    // 打开创建频道模态框
    openCreateChannel() {
      this.showCreateChannel = true
    },

    // 关闭创建频道模态框
    closeCreateChannel() {
      this.showCreateChannel = false
    },

    // 处理频道创建
    handleChannelCreate(channelData) {
      // 这里应该调用 API 创建频道
      console.log('Creating channel:', channelData)
      
      // 模拟创建成功
      const newChannel = {
        id: Date.now().toString(),
        name: channelData.name,
        type: channelData.type,
        hasUnread: false
      }

      // 添加到对应分类
      const category = this.categories.find(c => 
        (channelData.type === 'voice' && c.id === 'voice') ||
        (channelData.type === 'text' && c.id === 'text')
      )

      if (category) {
        category.channels.push(newChannel)
      }

      // 选择新创建的频道
      this.selectChannel(newChannel)
    },

    // 邀请成员到频道
    inviteToChannel(channel) {
      // TODO: 实现邀请功能
      console.log('Inviting to channel:', channel)
    },

    // 打开频道设置
    openChannelSettings(channel) {
      // TODO: 实现频道设置功能
      console.log('Opening channel settings:', channel)
    }
  }
}
</script>

<style scoped>
.channel-list {
  padding: 0 8px;
}

.channel-category {
  margin-bottom: 8px;
}

.category-header {
  display: flex;
  align-items: center;
  padding: 6px 4px;
  cursor: pointer;
  user-select: none;
  color: var(--text-muted);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.category-arrow {
  font-size: 0.625rem;
  margin-right: 4px;
  transition: transform 0.2s ease;
}

.category-arrow.expanded {
  transform: rotate(90deg);
}

.category-name {
  flex: 1;
  font-weight: 600;
}

.add-channel-button {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 1.25rem;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.category-header:hover .add-channel-button {
  opacity: 1;
}

.add-channel-button:hover {
  color: var(--text-normal);
}

.channels {
  margin-top: 2px;
}

.channel-item {
  display: flex;
  align-items: center;
  padding: 6px 8px;
  margin: 1px 0;
  border-radius: 4px;
  cursor: pointer;
  color: var(--text-muted);
  font-size: 0.9375rem;
  transition: all 0.2s ease;
}

.channel-item:hover {
  background-color: var(--background-modifier-hover);
  color: var(--text-normal);
}

.channel-item.active {
  background-color: var(--background-modifier-selected);
  color: var(--text-normal);
}

.channel-icon {
  margin-right: 6px;
  font-size: 1.25rem;
  width: 20px;
  text-align: center;
}

.channel-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.channel-actions {
  display: flex;
  gap: 4px;
  margin-left: 4px;
}

.action-button {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 0.875rem;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.channel-item:hover .action-button {
  opacity: 1;
}

.action-button:hover {
  color: var(--text-normal);
}

.unread-indicator {
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  background-color: var(--primary-color);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.channel-item.unread {
  color: var(--text-normal);
  font-weight: 500;
}
</style> 