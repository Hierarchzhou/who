<template>
  <div class="sticker-picker">
    <!-- 标题 -->
    <div class="sticker-picker-header">
      {{ currentCategory === 'trending' ? '热门表情' : categories.find(c => c.id === currentCategory)?.name || '表情包' }}
    </div>

    <!-- 搜索框 -->
    <div class="search-container">
      <input 
        type="text" 
        v-model="searchQuery"
        placeholder="搜索表情包..."
        @input="handleSearch"
        class="search-input"
      />
    </div>

    <!-- 分类标签 -->
    <div class="categories">
      <button 
        v-for="category in categories" 
        :key="category.id"
        @click="selectCategory(category)"
        :class="['category-btn', { active: currentCategory === category.id }]"
      >
        {{ category.name }}
      </button>
    </div>

    <!-- 表情包网格 -->
    <div class="stickers-grid" ref="gridContainer">
      <template v-if="stickers.length > 0">
        <div 
          v-for="sticker in stickers" 
          :key="sticker.id" 
          class="sticker-item"
          @click="selectSticker(sticker)"
        >
          <!-- 使用固定宽度的图片 -->
          <img 
            :src="sticker.images.fixed_width.url"
            :alt="sticker.title"
            loading="lazy"
          />
        </div>
        <!-- 将加载提示移到底部 -->
        <div v-if="loading" class="loading-more">
          加载更多...
        </div>
      </template>
      <div v-else-if="loading" class="loading">加载中...</div>
      <div v-else class="no-results">未找到相关表情</div>
    </div>
  </div>
</template>

<script>
import { GiphyFetch } from '@giphy/js-fetch-api'
import { GIPHY_API_KEY, GIPHY_CONFIG } from '@/config/giphy'

// 初始化 GIPHY API 客户端
const gf = new GiphyFetch(GIPHY_API_KEY)

export default {
  name: 'StickerPicker',
  data() {
    return {
      searchQuery: '',
      stickers: [],
      loading: false,
      currentCategory: 'trending',
      categories: [
        { id: 'trending', name: '热门', searchTerm: '' },
        { id: 'reactions', name: '反应', searchTerm: 'reaction' },
        { id: 'memes', name: '梗图', searchTerm: 'meme' },
        { id: 'anime', name: '动漫', searchTerm: 'anime' },
        { id: 'cute', name: '可爱', searchTerm: 'cute' }
      ],
      searchTimeout: null,
      offset: 0,  // 添加 offset 用于分页
      hasMore: true  // 是否还有更多数据
    }
  },
  methods: {
    async fetchStickers(options = {}, loadMore = false) {
      if (!loadMore) {
        this.offset = 0
        this.hasMore = true
      }
      
      if (!this.hasMore || this.loading) return

      this.loading = true
      try {
        let response
        const params = {
          ...GIPHY_CONFIG,
          ...options,
          type: 'stickers',
          limit: 20,
          offset: this.offset
        }

        const currentCategory = this.categories.find(c => c.id === this.currentCategory)
        const searchTerm = this.searchQuery || currentCategory?.searchTerm || ''

        if (searchTerm) {
          response = await gf.search(searchTerm, params)
        } else {
          response = await gf.trending(params)
        }

        // 更新数据
        if (loadMore) {
          const container = this.$refs.gridContainer
          const scrollTop = container.scrollTop

          this.stickers = [...this.stickers, ...response.data]

          this.$nextTick(() => {
            container.scrollTop = scrollTop
          })
        } else {
          this.stickers = response.data
        }

        // 更新分页信息
        this.offset += response.data.length
        this.hasMore = response.pagination.total_count > this.offset
      } catch (error) {
        console.error('Error fetching stickers:', error)
      }
      this.loading = false
    },

    handleScroll(event) {
      const container = event.target
      const scrollBottom = container.scrollHeight - container.scrollTop - container.clientHeight
      
      // 当滚动到距离底部 100px 时加载更多，增加提前加载的距离
      if (scrollBottom < 100 && !this.loading && this.hasMore) {
        this.fetchStickers({}, true)
      }
    },

    handleSearch() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }
      this.searchTimeout = setTimeout(() => {
        this.fetchStickers()
      }, 300)
    },

    selectCategory(category) {
      this.currentCategory = category.id
      this.searchQuery = ''  // 清空搜索框
      this.fetchStickers()
    },

    selectSticker(sticker) {
      this.$emit('select', {
        id: sticker.id,
        url: sticker.images.fixed_width.url,  // 使用固定宽度的图片
        title: sticker.title
      })
    }
  },
  mounted() {
    this.fetchStickers()
    // 添加滚动事件监听
    this.$refs.gridContainer.addEventListener('scroll', this.handleScroll)
  },
  beforeUnmount() {
    // 移除滚动事件监听
    this.$refs.gridContainer?.removeEventListener('scroll', this.handleScroll)
  }
}
</script>

<style scoped>
.sticker-picker {
  width: 420px;  /* 设置固定宽度 */
  height: 500px;  /* 增加高度 */
  display: flex;
  flex-direction: column;
  background: #2f3136;
  border-radius: 12px;  /* 增加圆角 */
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);  /* 增强阴影 */
  position: absolute;
  bottom: 100%;
  left: 0;
  margin-bottom: 8px;
}

.sticker-picker-header {
  padding: 16px 20px;  /* 增加水平内边距 */
  background: #202225;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.search-container {
  padding: 12px 20px;  /* 增加水平内边距 */
  background: #202225;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.search-input {
  width: 100%;
  padding: 10px 16px;  /* 增加内边距 */
  border-radius: 6px;  /* 增加圆角 */
  border: none;
  background: #40444b;
  color: #dcddde;
  font-size: 14px;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  background: #454950;
  box-shadow: 0 0 0 2px rgba(88, 101, 242, 0.3);  /* 添加焦点轮廓 */
}

.search-input::placeholder {
  color: #72767d;
}

.categories {
  padding: 8px 16px;  /* 增加水平内边距 */
  display: flex;
  gap: 8px;
  background: #2f3136;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  overflow-x: auto;
  scrollbar-width: none;
  position: relative;  /* 为底部指示条定位 */
}

.categories::-webkit-scrollbar {
  display: none;
}

.category-btn {
  padding: 8px 16px;  /* 增加内边距 */
  border: none;
  border-radius: 6px;  /* 增加圆角 */
  background: transparent;
  color: #b9bbbe;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 500;
  position: relative;
}

.category-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.05);
}

.category-btn.active {
  color: #fff;
  background: #454950;
}

.category-btn.active::after {
  content: '';
  position: absolute;
  bottom: -9px;
  left: 0;
  width: 100%;
  height: 2px;
  background: #5865f2;
  border-radius: 1px;
}

.stickers-grid {
  flex: 1;
  overflow-y: auto;
  padding: 16px;  /* 减小内边距以获得更多空间 */
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  background: #36393f;
  align-content: start;
}

.sticker-item {
  aspect-ratio: auto;  /* 移除固定宽高比，让它根据内容自适应 */
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #2f3136;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;  /* 减小内边距 */
  position: relative;
  min-height: 120px;  /* 设置最小高度 */
}

.sticker-item:hover {
  transform: translateY(-2px);
  background: #40444b;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.sticker-item img {
  max-width: 100%;
  max-height: 120px;  /* 限制最大高度 */
  width: auto;
  height: auto;
  object-fit: contain;  /* 确保图片完整显示 */
  transition: transform 0.2s ease;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));  /* 添加图片阴影 */
}

.sticker-item:hover img {
  transform: scale(1.05);
}

.loading {
  grid-column: 1 / -1;
  text-align: center;
  padding: 32px;  /* 增加内边距 */
  color: #72767d;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.loading::after {
  content: '';
  width: 20px;  /* 增加尺寸 */
  height: 20px;
  border: 2px solid #72767d;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-more {
  grid-column: 1 / -1;
  text-align: center;
  padding: 16px;
  color: #72767d;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: transparent;
}

.loading-more::after {
  content: '';
  width: 16px;
  height: 16px;
  border: 2px solid #72767d;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.no-results {
  grid-column: 1 / -1;
  text-align: center;
  padding: 32px;
  color: #72767d;
  font-size: 14px;
}

/* 滚动条样式 */
.stickers-grid::-webkit-scrollbar {
  width: 6px;  /* 减小宽度 */
}

.stickers-grid::-webkit-scrollbar-track {
  background: transparent;
}

.stickers-grid::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.stickers-grid::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style> 