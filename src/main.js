import { createApp } from 'vue'
import App from './App.vue'
import store from './store'  // 导入 Vuex store
import './assets/themes.css'

const app = createApp(App)
app.use(store)  // 注册 Vuex store
app.mount('#app')
