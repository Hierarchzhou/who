/**
 * 头像工具函数
 * 这个文件包含与用户头像相关的工具函数
 */

// 默认头像颜色数组 - Discord风格的颜色
const avatarColors = [
  '7289da', // Discord蓝
  '43b581', // Discord绿
  'faa61a', // Discord黄
  'f04747', // Discord红
  '593695', // Discord紫
  '747f8d',  // Discord灰
  '2c2f33', // Discord深灰
  '99aab5',  // Discord浅灰
  'ff6b6b', // 珊瑚红
  '4ecdc4', // 薄荷绿
  '45b7d1', // 天空蓝
  'a67f5d', // 暖棕色
  'b056db', // 梦幻紫
  'f7d794'  // 温暖黄
];

// 预定义的头像样式
export const avatarStyles = [
  'micah',      // 现代简约风格
  'avataaars',  // 卡通人物
  'bottts',     // 机器人风格
  'personas',   // 像素艺术风格
  'thumbs',     // 拇指风格
  'lorelei',    // 可爱风格
  'notionists', // 商务风格
  'adventurer', // 冒险家风格
  'fun-emoji',  // 表情符号风格
  'big-smile'   // 微笑风格
];

/**
 * 获取基于用户名的随机头像URL
 * @param {string} username - 用户名
 * @param {number} size - 头像尺寸（像素）
 * @returns {string} - 头像URL
 */
export function getRandomAvatarUrl(username, size = 200) {
  if (!username || username.trim() === '') {
    return getFallbackAvatarUrl();
  }
  
  try {
    // 基于用户名生成一个一致的随机数，这样同一用户名总是得到相同的头像
    const randomIndex = Math.abs(hashCode(username)) % avatarColors.length;
    const color = avatarColors[randomIndex];
    
    // 使用UI Avatars服务生成基于文字的头像
    // 这个服务会根据用户名生成一个包含用户名首字母的头像
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=${color}&color=fff&size=${size}`;
  } catch (error) {
    console.error('生成头像URL失败:', error);
    return getFallbackAvatarUrl();
  }
}

/**
 * 获取随机的默认头像URL
 * @returns {string} - 随机默认头像URL
 */
export function getRandomDefaultAvatarUrl() {
  try {
    // 随机选择一个颜色
    const randomIndex = Math.floor(Math.random() * avatarColors.length);
    const color = avatarColors[randomIndex];
    
    // 随机选择一个样式
    const styleIndex = Math.floor(Math.random() * avatarStyles.length);
    const style = avatarStyles[styleIndex];
    
    // 生成一个随机的种子
    const seed = Math.floor(Math.random() * 10000);
    
    // 使用DiceBear API生成多样化的头像
    return `https://api.dicebear.com/6.x/${style}/svg?seed=${seed}&backgroundColor=${color}`;
  } catch (error) {
    console.error('生成随机头像URL失败:', error);
    return getFallbackAvatarUrl();
  }
}

/**
 * 获取备用头像URL（当其他方法失败时使用）
 * @returns {string} - 备用头像URL
 */
export function getFallbackAvatarUrl() {
  // 使用一个简单的灰色头像作为备用
  return 'https://ui-avatars.com/api/?name=用户&background=747f8d&color=fff&size=200';
}

/**
 * 简单的字符串哈希函数
 * @param {string} str - 要哈希的字符串
 * @returns {number} - 哈希值
 */
function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0; // 转换为32位整数
  }
  return hash;
}

/**
 * 检查URL是否是有效的图片URL
 * @param {string} url - 要检查的URL
 * @returns {boolean} - 是否是有效的图片URL
 */
export function isValidImageUrl(url) {
  if (!url) return false;
  return /\.(jpeg|jpg|gif|png|svg)$/i.test(url) || 
         url.startsWith('https://ui-avatars.com/') || 
         url.startsWith('https://avatars.dicebear.com/');
}

/**
 * 处理头像加载错误
 * @param {Event} event - 错误事件
 */
export function handleAvatarError(event) {
  // 当头像加载失败时，替换为备用头像
  event.target.src = getFallbackAvatarUrl();
} 