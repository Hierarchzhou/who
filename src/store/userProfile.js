// 用户资料状态管理
export const userProfileStore = {
  namespaced: true,  // 启用命名空间
  
  state: {
    username: '',  // 用户名
    avatar: '',    // 头像URL
    bio: '',       // 个人简介
    status: 'online'  // 用户状态
  },
  
  mutations: {
    // 更新用户名
    UPDATE_USERNAME(state, username) {
      state.username = username;
    },
    
    // 更新头像
    UPDATE_AVATAR(state, avatar) {
      state.avatar = avatar;
    },
    
    // 更新个人简介
    UPDATE_BIO(state, bio) {
      state.bio = bio;
    },
    
    // 更新用户状态
    UPDATE_STATUS(state, status) {
      state.status = status;
    },
    
    // 更新整个用户资料
    UPDATE_PROFILE(state, profile) {
      if (profile.username) state.username = profile.username;
      if (profile.avatar) state.avatar = profile.avatar;
      if (profile.bio) state.bio = profile.bio;
      if (profile.status) state.status = profile.status;
    }
  },
  
  actions: {
    // 设置用户名
    setUsername({ commit }, username) {
      commit('UPDATE_USERNAME', username);
    },
    
    // 设置头像
    setAvatar({ commit }, avatar) {
      commit('UPDATE_AVATAR', avatar);
    },
    
    // 设置个人简介
    setBio({ commit }, bio) {
      commit('UPDATE_BIO', bio);
    },
    
    // 设置用户状态
    setStatus({ commit }, status) {
      commit('UPDATE_STATUS', status);
    },
    
    // 更新整个用户资料
    updateProfile({ commit }, profile) {
      commit('UPDATE_PROFILE', profile);
    }
  },
  
  getters: {
    // 获取用户名
    username: state => state.username,
    
    // 获取头像URL
    avatar: state => state.avatar,
    
    // 获取个人简介
    bio: state => state.bio,
    
    // 获取用户状态
    status: state => state.status,
    
    // 获取完整的用户资料
    profile: state => ({
      username: state.username,
      avatar: state.avatar,
      bio: state.bio,
      status: state.status
    })
  }
}; 