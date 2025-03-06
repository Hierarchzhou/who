import { createStore } from 'vuex'
import { userProfileStore } from './userProfile'

export default createStore({
  modules: {
    userProfile: userProfileStore
  }
}) 