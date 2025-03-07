import { createStore } from 'vuex'
import { userProfileStore } from './userProfile'
import { messagesStore } from './messages'

export default createStore({
  modules: {
    userProfile: userProfileStore,
    messages: messagesStore
  }
}) 