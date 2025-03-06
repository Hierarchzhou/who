<template>
  <div class="sticker-message">
    <img 
      :src="stickerUrl" 
      :alt="stickerId"
      @load="onLoad"
      v-if="stickerUrl"
      class="sticker-image"
    />
    <div v-else class="sticker-loading">
      加载中...
    </div>
  </div>
</template>

<script>
import { GiphyFetch } from '@giphy/js-fetch-api'
import { GIPHY_API_KEY } from '@/config/giphy'

// 初始化 GIPHY API 客户端
const gf = new GiphyFetch(GIPHY_API_KEY)

export default {
  name: 'StickerMessage',
  props: {
    stickerId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      stickerUrl: null
    }
  },
  methods: {
    async fetchSticker() {
      try {
        const { data } = await gf.gif(this.stickerId)
        this.stickerUrl = data.images.fixed_height.url
      } catch (error) {
        console.error('Error fetching sticker:', error)
      }
    },
    onLoad() {
      this.$emit('loaded')
    }
  },
  created() {
    this.fetchSticker()
  }
}
</script>

<style scoped>
.sticker-message {
  display: inline-block;
  max-width: 160px;  /* 调整最大宽度 */
  max-height: 160px;  /* 调整最大高度 */
  min-width: 60px;   /* 添加最小宽度 */
  min-height: 60px;  /* 添加最小高度 */
  border-radius: 4px;
  overflow: hidden;
  background: var(--background-secondary, #36393f);
}

.sticker-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  vertical-align: middle;
  transition: transform 0.2s ease;
}

.sticker-image:hover {
  transform: scale(1.05);
}

.sticker-loading {
  padding: 8px;
  text-align: center;
  color: var(--text-muted, #72767d);
  font-size: 0.875rem;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--background-secondary, #36393f);
  border-radius: 4px;
}
</style> 