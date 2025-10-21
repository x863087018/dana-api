# 快速修复指南

## 问题：服务器启动报错 "DecoratorManager not singleton"

### 🚀 快速解决（3 步）

在服务器上执行以下命令：

```bash
# 1. 进入项目目录
cd /root/dana-api

# 2. 运行诊断工具
npm run diagnose

# 3. 如果诊断发现问题，执行清理并重装
pm2 stop dana-api
rm -rf node_modules package-lock.json
npm cache clean --force
npm install --production
pm2 start ecosystem.config.js --env production
```

### ✅ 验证修复

```bash
# 查看应用状态
pm2 status

# 查看日志
pm2 logs dana-api

# 如果看到 "启动成功" 和 "应用正在监听端口 1123"，说明修复成功
```

### 📝 详细文档

- **完整故障排除**: 参考 `SERVER_TROUBLESHOOT.md`
- **部署指南**: 参考 `DEPLOY.md`

### 🔍 如果问题仍然存在

1. **检查 Node.js 版本**
   ```bash
   node -v  # 应该 >= 12.0.0
   ```

2. **检查 @midwayjs/core 版本**
   ```bash
   npm ls @midwayjs/core
   # 应该只看到一个版本
   ```

3. **查看完整错误日志**
   ```bash
   pm2 logs dana-api --lines 100 --err
   ```

4. **尝试手动启动测试**
   ```bash
   cd /root/dana-api
   NODE_ENV=production node bootstrap.js
   # 看是否报错
   ```

### 💡 预防措施

**下次部署时：**

1. 在本地确保有 `package-lock.json`
2. 上传到服务器时包含 `package-lock.json`
3. 使用 `npm ci --production` 而不是 `npm install`

```bash
# 推荐的部署流程
cd /root/dana-api
git pull  # 如果使用 git
npm ci --production  # 而不是 npm install
pm2 restart dana-api
```

### 📞 需要帮助？

如果以上步骤都无法解决，请提供：
1. `npm run diagnose` 的完整输出
2. `node -v` 和 `npm -v` 的输出
3. `pm2 logs dana-api --lines 50` 的输出
4. `npm ls @midwayjs/core` 的输出

