/**
 * 格式化时间戳为友好的显示格式
 * @param {number|string} timestamp - 时间戳
 * @returns {string} 格式化后的时间字符串
 */
export function formatTimestamp(timestamp) {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  // 1分钟内
  if (diffMins < 1) {
    return '刚刚';
  }
  
  // 1小时内
  if (diffHours < 1) {
    return `${diffMins}分钟前`;
  }
  
  // 今天内
  if (diffDays < 1) {
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  }
  
  // 昨天
  if (diffDays === 1) {
    return `昨天 ${date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit'
    })}`;
  }
  
  // 一周内
  if (diffDays < 7) {
    return `${diffDays}天前`;
  }
  
  // 更早的消息显示完整日期
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
} 