// 这个脚本用于启动API服务器
const { spawn } = require('child_process'); // 引入子进程模块
const path = require('path'); // 引入路径模块

// 服务器文件路径
const serverPath = path.join(__dirname, 'server.js');

// 启动服务器进程
const server = spawn('node', [serverPath], {
  stdio: 'inherit' // 将子进程的标准输入/输出/错误流连接到父进程
});

console.log('正在启动API服务器...');

// 监听进程退出事件
server.on('close', (code) => {
  console.log(`服务器进程已退出，退出码: ${code}`);
});

// 处理进程信号
process.on('SIGINT', () => {
  console.log('接收到中断信号，正在关闭服务器...');
  server.kill('SIGINT');
  process.exit(0); // 退出父进程
}); 