#!/usr/bin/env node

/**
 * Dana API 诊断工具
 * 用于检查常见的部署问题
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Dana API 诊断工具\n');
console.log('=' .repeat(50));

const checks = [];
let hasErrors = false;

// 检查 1: Node.js 版本
console.log('\n✓ 检查 Node.js 版本...');
try {
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  console.log(`  Node.js 版本: ${nodeVersion}`);
  
  if (majorVersion < 12) {
    console.log('  ❌ 错误: Node.js 版本过低，需要 >= 12.0.0');
    hasErrors = true;
  } else {
    console.log('  ✅ Node.js 版本符合要求');
  }
} catch (error) {
  console.log('  ❌ 无法检查 Node.js 版本:', error.message);
  hasErrors = true;
}

// 检查 2: npm 版本
console.log('\n✓ 检查 npm 版本...');
try {
  const npmVersion = execSync('npm -v', { encoding: 'utf-8' }).trim();
  console.log(`  npm 版本: ${npmVersion}`);
  console.log('  ✅ npm 可用');
} catch (error) {
  console.log('  ❌ npm 不可用:', error.message);
  hasErrors = true;
}

// 检查 3: package.json 是否存在
console.log('\n✓ 检查 package.json...');
if (fs.existsSync('package.json')) {
  console.log('  ✅ package.json 存在');
  try {
    const pkg = require('./package.json');
    console.log(`  项目名称: ${pkg.name}`);
    console.log(`  项目版本: ${pkg.version}`);
  } catch (error) {
    console.log('  ❌ package.json 格式错误:', error.message);
    hasErrors = true;
  }
} else {
  console.log('  ❌ package.json 不存在');
  hasErrors = true;
}

// 检查 4: package-lock.json 是否存在
console.log('\n✓ 检查 package-lock.json...');
if (fs.existsSync('package-lock.json')) {
  console.log('  ✅ package-lock.json 存在（推荐）');
} else {
  console.log('  ⚠️  package-lock.json 不存在（建议生成）');
}

// 检查 5: node_modules 是否存在
console.log('\n✓ 检查 node_modules...');
if (fs.existsSync('node_modules')) {
  console.log('  ✅ node_modules 存在');
  
  // 检查关键依赖
  const criticalDeps = [
    '@midwayjs/core',
    '@midwayjs/koa',
    '@midwayjs/bootstrap',
    '@midwayjs/typegoose'
  ];
  
  console.log('  检查关键依赖:');
  criticalDeps.forEach(dep => {
    const depPath = path.join('node_modules', dep);
    if (fs.existsSync(depPath)) {
      console.log(`    ✅ ${dep}`);
    } else {
      console.log(`    ❌ ${dep} 缺失`);
      hasErrors = true;
    }
  });
} else {
  console.log('  ❌ node_modules 不存在，需要运行 npm install');
  hasErrors = true;
}

// 检查 6: @midwayjs/core 版本
console.log('\n✓ 检查 @midwayjs/core 版本...');
try {
  const result = execSync('npm ls @midwayjs/core', { encoding: 'utf-8' });
  console.log('  输出:');
  result.split('\n').forEach(line => {
    if (line.trim()) {
      console.log(`    ${line}`);
    }
  });
  
  // 检查是否有重复版本
  const coreMatches = result.match(/@midwayjs\/core@/g);
  if (coreMatches && coreMatches.length > 1) {
    console.log('  ❌ 错误: 检测到多个 @midwayjs/core 版本！');
    console.log('  这会导致 "DecoratorManager not singleton" 错误');
    console.log('  解决方案: 删除 node_modules 并重新安装');
    hasErrors = true;
  } else {
    console.log('  ✅ @midwayjs/core 版本正常');
  }
} catch (error) {
  // npm ls 在找不到包时会返回错误码
  const output = error.stdout || error.message;
  console.log('  输出:', output);
  if (output.includes('missing') || output.includes('UNMET')) {
    console.log('  ❌ 依赖缺失或不匹配');
    hasErrors = true;
  }
}

// 检查 7: dist 目录
console.log('\n✓ 检查 dist 目录...');
if (fs.existsSync('dist')) {
  console.log('  ✅ dist 目录存在');
  
  // 检查关键文件
  const criticalFiles = [
    'dist/configuration.js',
    'dist/controller',
    'dist/service'
  ];
  
  criticalFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`    ✅ ${file}`);
    } else {
      console.log(`    ⚠️  ${file} 不存在（可能需要编译）`);
    }
  });
} else {
  console.log('  ⚠️  dist 目录不存在（可能需要运行 npm run build）');
}

// 检查 8: bootstrap.js
console.log('\n✓ 检查 bootstrap.js...');
if (fs.existsSync('bootstrap.js')) {
  console.log('  ✅ bootstrap.js 存在');
} else {
  console.log('  ❌ bootstrap.js 不存在');
  hasErrors = true;
}

// 检查 9: 环境变量
console.log('\n✓ 检查环境变量...');
console.log(`  NODE_ENV: ${process.env.NODE_ENV || '(未设置)'}`);
console.log(`  PORT: ${process.env.PORT || '(未设置)'}`);
console.log(`  NODE_PATH: ${process.env.NODE_PATH || '(未设置)'}`);

// 检查 10: 文件权限
console.log('\n✓ 检查文件权限...');
try {
  const stats = fs.statSync('.');
  console.log(`  当前目录权限: ${stats.mode.toString(8).slice(-3)}`);
  
  // 检查是否可读写
  fs.accessSync('.', fs.constants.R_OK | fs.constants.W_OK);
  console.log('  ✅ 有读写权限');
} catch (error) {
  console.log('  ❌ 权限不足:', error.message);
  hasErrors = true;
}

// 总结
console.log('\n' + '='.repeat(50));
console.log('\n📊 诊断总结:');
if (hasErrors) {
  console.log('  ❌ 发现问题，请参考上述错误信息进行修复');
  console.log('\n建议的修复步骤:');
  console.log('  1. rm -rf node_modules package-lock.json');
  console.log('  2. npm cache clean --force');
  console.log('  3. npm install --production');
  console.log('  4. npm ls @midwayjs/core  # 验证只有一个版本');
  console.log('  5. node bootstrap.js  # 测试启动');
  console.log('\n详细的故障排除指南请参考 SERVER_TROUBLESHOOT.md');
  process.exit(1);
} else {
  console.log('  ✅ 所有检查通过！');
  console.log('\n可以尝试启动应用:');
  console.log('  NODE_ENV=production node bootstrap.js');
  process.exit(0);
}

