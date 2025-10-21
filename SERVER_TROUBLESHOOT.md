# 服务器部署故障排除

## 当前问题：DecoratorManager not singleton & Main framework missing

### 问题原因
这个错误通常由以下原因引起：
1. 服务器上的 `node_modules` 中存在多个版本的 `@midwayjs/core`
2. 依赖安装不完整或存在冲突
3. npm/yarn 缓存问题

### 解决步骤

#### 步骤 1：清理并重新安装依赖（首选方案）

在服务器上执行：

```bash
cd /root/dana-api

# 1. 停止应用
pm2 stop dana-api

# 2. 清理现有依赖
rm -rf node_modules
rm -f package-lock.json

# 3. 清理 npm 缓存
npm cache clean --force

# 4. 重新安装依赖
npm install --production

# 5. 检查 @midwayjs/core 版本
npm ls @midwayjs/core

# 应该只看到一个版本，类似：
# dana-api@1.0.0 /root/dana-api
# └── @midwayjs/core@3.18.0

# 6. 重启应用
pm2 start ecosystem.config.js --env production
```

#### 步骤 2：如果步骤 1 无效，检查 Node.js 版本

```bash
node -v
# 应该是 >= 12.0.0，推荐使用 16.x 或 18.x

# 如果版本过低，升级 Node.js
# 使用 nvm 或者直接下载安装
```

#### 步骤 3：检查是否有全局安装的冲突包

```bash
# 检查全局包
npm ls -g @midwayjs/core

# 如果有，卸载它
npm uninstall -g @midwayjs/core
```

#### 步骤 4：使用 npm ci 替代 npm install

```bash
cd /root/dana-api

# 确保有 package-lock.json
# 如果没有，从本地复制一份到服务器

npm ci --production

pm2 restart dana-api
```

#### 步骤 5：检查文件权限

```bash
# 确保当前用户有权限读取所有文件
ls -la /root/dana-api

# 如果需要，修改权限
sudo chown -R $USER:$USER /root/dana-api
```

### 验证修复

```bash
# 1. 直接运行测试
cd /root/dana-api
NODE_ENV=production node bootstrap.js

# 2. 如果直接运行成功，使用 PM2 启动
pm2 start ecosystem.config.js --env production

# 3. 查看日志
pm2 logs dana-api

# 4. 查看状态
pm2 status
```

### 预防措施

#### 1. 在本地生成 package-lock.json
```bash
# 本地执行
npm install
# 将 package-lock.json 提交到 git
```

#### 2. 部署时使用一致的安装方式
```bash
# 服务器上始终使用
npm ci --production
# 而不是 npm install
```

#### 3. 锁定依赖版本
在 `package.json` 中移除依赖版本号前的 `^` 符号，确保版本固定。

#### 4. 检查部署清单

确保部署到服务器的文件包括：
- ✅ `dist/` 目录（编译后的代码）
- ✅ `package.json`
- ✅ `package-lock.json`（重要！）
- ✅ `bootstrap.js`
- ✅ `ecosystem.config.js`
- ✅ `node_modules/` 或在服务器上执行 `npm install`

### 额外诊断命令

如果问题仍然存在，运行以下命令收集信息：

```bash
# 1. 检查所有 midway 相关包
npm ls | grep midway

# 2. 检查 node_modules 结构
ls -la node_modules/@midwayjs/

# 3. 检查是否有软链接问题
find node_modules -type l

# 4. 查看完整的依赖树
npm ls --depth=2

# 5. 检查环境变量
echo $NODE_ENV
echo $NODE_PATH
```

### 如果以上都不工作

最后的办法 - 完全重新部署：

```bash
# 1. 备份配置文件
cp /root/dana-api/src/config/config.production.ts ~/backup/

# 2. 删除整个项目
rm -rf /root/dana-api

# 3. 重新从 git 克隆或从本地上传
# git clone ... 或 scp ...

# 4. 恢复配置文件
# cp ~/backup/config.production.ts /root/dana-api/src/config/

# 5. 全新安装
cd /root/dana-api
npm install --production

# 6. 启动
pm2 start ecosystem.config.js --env production
```

### 联系信息

如果问题仍然存在，请提供以下信息：
1. Node.js 版本: `node -v`
2. npm 版本: `npm -v`
3. 操作系统: `uname -a`
4. 完整错误日志: `pm2 logs dana-api --lines 100`
5. 依赖树: `npm ls @midwayjs/core`

