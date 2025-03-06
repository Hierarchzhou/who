/**
 * 打包脚本 - 用于构建Vue应用并复制API服务器到dist目录
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 颜色函数
const colors = {
  green: text => `\x1b[32m${text}\x1b[0m`,
  blue: text => `\x1b[34m${text}\x1b[0m`,
  yellow: text => `\x1b[33m${text}\x1b[0m`,
  red: text => `\x1b[31m${text}\x1b[0m`
};

// 打印带时间戳的日志
function log(message, type = 'info') {
  const date = new Date().toLocaleTimeString();
  const prefix = `[${date}]`;
  
  switch (type) {
    case 'success':
      console.log(`${prefix} ${colors.green('✓')} ${message}`);
      break;
    case 'info':
      console.log(`${prefix} ${colors.blue('ℹ')} ${message}`);
      break;
    case 'warn':
      console.log(`${prefix} ${colors.yellow('⚠')} ${message}`);
      break;
    case 'error':
      console.log(`${prefix} ${colors.red('✗')} ${message}`);
      break;
    default:
      console.log(`${prefix} ${message}`);
  }
}

// 确保目录存在
function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    log(`创建目录: ${dir}`, 'success');
  }
}

// 复制目录
function copyDirectory(source, destination) {
  ensureDirectoryExists(destination);
  
  const files = fs.readdirSync(source);
  
  files.forEach(file => {
    const sourcePath = path.join(source, file);
    const destPath = path.join(destination, file);
    
    if (fs.statSync(sourcePath).isDirectory()) {
      copyDirectory(sourcePath, destPath);
    } else {
      fs.copyFileSync(sourcePath, destPath);
      log(`复制文件: ${sourcePath} -> ${destPath}`, 'success');
    }
  });
}

// 创建启动脚本
function createStartScript() {
  const scriptContent = `
const express = require('express');
const path = require('path');
const apiServer = require('./api/server');

const app = express();
const PORT = process.env.PORT || 3000;

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

// 所有请求都返回index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 启动服务器
app.listen(PORT, () => {
  console.log(\`应用已启动: http://localhost:\${PORT}\`);
  console.log(\`API服务器运行在 http://localhost:3001\`);
});

// 启动API服务器
apiServer.start();
`;

  fs.writeFileSync(path.join('dist', 'server.js'), scriptContent);
  log('创建启动脚本: dist/server.js', 'success');
}

// 创建package.json
function createPackageJson() {
  const originalPackage = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  const newPackage = {
    name: originalPackage.name,
    version: originalPackage.version,
    private: true,
    scripts: {
      start: 'node server.js'
    },
    dependencies: {
      express: originalPackage.dependencies.express,
      cors: originalPackage.dependencies.cors,
      'body-parser': originalPackage.dependencies['body-parser']
    }
  };
  
  fs.writeFileSync(
    path.join('dist', 'package.json'), 
    JSON.stringify(newPackage, null, 2)
  );
  
  log('创建package.json: dist/package.json', 'success');
}

// 执行构建
async function build() {
  try {
    // 步骤1: 清理dist目录
    log('开始构建生产版本...', 'info');
    log('步骤1: 清理dist目录', 'info');
    if (fs.existsSync('dist')) {
      fs.rmSync('dist', { recursive: true, force: true });
    }
    ensureDirectoryExists('dist');
    
    // 步骤2: 构建Vue应用
    log('步骤2: 构建Vue应用', 'info');
    execSync('npm run build', { stdio: 'inherit' });
    
    // 步骤3: 复制API服务器
    log('步骤3: 复制API服务器', 'info');
    ensureDirectoryExists('dist/api');
    copyDirectory('api', 'dist/api');
    
    // 步骤4: 创建服务器启动脚本
    log('步骤4: 创建服务器启动脚本', 'info');
    createStartScript();
    
    // 步骤5: 创建package.json
    log('步骤5: 创建package.json', 'info');
    createPackageJson();
    
    // 步骤6: 创建安装和启动说明
    log('步骤6: 创建说明文档', 'info');
    fs.writeFileSync(
      path.join('dist', 'README.md'),
      `# Vue聊天应用 - 生产版本

## 安装和运行
1. 安装依赖: \`npm install\`
2. 启动服务器: \`npm start\`
3. 访问应用: http://localhost:3000

## 说明
- 此应用包含前端和API服务器
- 所有数据存储在本地的JSON文件中
- API服务器运行在端口3001
- 前端页面运行在端口3000
`
    );

    // 完成
    log('构建完成！', 'success');
    log('生产版本位于dist目录', 'info');
    log('运行方式:', 'info');
    log('1. cd dist', 'info');
    log('2. npm install', 'info');
    log('3. npm start', 'info');
    
  } catch (error) {
    log(`构建失败: ${error.message}`, 'error');
    process.exit(1);
  }
}

// 执行构建
build(); 