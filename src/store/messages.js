// 消息管理模块
export const messagesStore = {
  namespaced: true,

  state: {
    // 按频道ID存储消息
    channelMessages: {},
    // 消息加载状态
    loading: false,
    // 错误信息
    error: null
  },

  mutations: {
    // 设置频道消息
    SET_CHANNEL_MESSAGES(state, { channelId, messages }) {
      state.channelMessages = {
        ...state.channelMessages,
        [channelId]: messages
      }
    },

    // 添加消息到频道
    ADD_MESSAGE(state, { channelId, message }) {
      if (!state.channelMessages[channelId]) {
        state.channelMessages[channelId] = []
      }
      state.channelMessages[channelId].push(message)
    },

    // 更新消息
    UPDATE_MESSAGE(state, { channelId, messageId, updates }) {
      const messages = state.channelMessages[channelId]
      if (!messages) return

      const index = messages.findIndex(msg => msg.id === messageId)
      if (index !== -1) {
        messages[index] = { ...messages[index], ...updates }
      }
    },

    // 删除消息
    DELETE_MESSAGE(state, { channelId, messageId }) {
      const messages = state.channelMessages[channelId]
      if (!messages) return

      const index = messages.findIndex(msg => msg.id === messageId)
      if (index !== -1) {
        messages.splice(index, 1)
      }
    },

    // 设置加载状态
    SET_LOADING(state, loading) {
      state.loading = loading
    },

    // 设置错误信息
    SET_ERROR(state, error) {
      state.error = error
    },

    // 清除频道消息
    CLEAR_CHANNEL_MESSAGES(state, channelId) {
      delete state.channelMessages[channelId]
    }
  },

  actions: {
    // 获取频道消息
    async fetchChannelMessages({ commit }, channelId) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      try {
        // TODO: 调用API获取频道消息
        const messages = []  // 这里应该是API返回的消息
        commit('SET_CHANNEL_MESSAGES', { channelId, messages })
      } catch (error) {
        commit('SET_ERROR', error.message)
        console.error('获取频道消息失败:', error)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // 发送消息
    async sendMessage({ commit }, messageData) {
      try {
        // TODO: 调用API发送消息
        const message = {
          id: Date.now().toString(),
          ...messageData,
          status: 'sent'
        }
        
        commit('ADD_MESSAGE', {
          channelId: messageData.channelId,
          message
        })

        return message
      } catch (error) {
        console.error('发送消息失败:', error)
        throw error
      }
    },

    // 更新消息
    async updateMessage({ commit }, { channelId, messageId, updates }) {
      try {
        // TODO: 调用API更新消息
        commit('UPDATE_MESSAGE', { channelId, messageId, updates })
      } catch (error) {
        console.error('更新消息失败:', error)
        throw error
      }
    },

    // 删除消息
    async deleteMessage({ commit }, { channelId, messageId }) {
      try {
        // TODO: 调用API删除消息
        commit('DELETE_MESSAGE', { channelId, messageId })
      } catch (error) {
        console.error('删除消息失败:', error)
        throw error
      }
    }
  },

  getters: {
    // 获取频道的所有消息
    channelMessages: state => channelId => {
      return state.channelMessages[channelId] || []
    },

    // 获取频道的最后一条消息
    lastChannelMessage: state => channelId => {
      const messages = state.channelMessages[channelId]
      return messages && messages.length > 0 ? messages[messages.length - 1] : null
    },

    // 获取频道的未读消息数
    unreadCount: state => (channelId, lastReadTimestamp) => {
      const messages = state.channelMessages[channelId]
      if (!messages || !lastReadTimestamp) return 0

      return messages.filter(msg => new Date(msg.timestamp) > new Date(lastReadTimestamp)).length
    },

    // 获取加载状态
    isLoading: state => state.loading,

    // 获取错误信息
    error: state => state.error
  }
} 