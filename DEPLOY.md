# Dana API 部署指南

本文档提供将 Dana API 项目部署到生产服务器的步骤。

## 准备工作

1. 服务器环境要求:
   - Node.js 版本 >= 12.0.0 (推荐 16.x)
   - MongoDB 服务器
   - PM2 进程管理器

2. 安装 PM2:
   ```bash
   npm install -g pm2
   ```

## 部署步骤

### 1. 配置生产环境

在部署前，确保修改 `src/config/config.production.ts` 文件，配置正确的:
- MongoDB 连接信息
- 服务器端口
- WebSocket 设置
- 其他环境相关配置

```typescript
// 例如修改 MongoDB 连接
mongoose: {
  dataSource: {
    default: {
      uri: 'mongodb://用户名:密码@服务器IP:27017/dana',
      // ...
    }
  }
}
```

### 2. 构建项目

在本地构建项目:

```bash
npm run build:prod
```

这将编译 TypeScript 代码并将 PM2 配置文件复制到 `dist` 目录。

### 3. 部署到服务器

将以下文件和目录上传到服务器:
- `dist/` 目录 (包含编译后的代码)
- `ecosystem.config.js` (PM2 配置文件)
- `package.json` 和 `package-lock.json`
- `bootstrap.js` (入口文件)

### 4. 在服务器上安装依赖

```bash
npm install --production
```

### 5. 使用 PM2 启动应用

```bash
pm2 start ecosystem.config.js --env production
```

或者使用 npm 脚本:

```bash
npm run pm2:start
```

### 6. 其他 PM2 命令

- 查看应用状态: `npm run pm2:status`
- 查看日志: `npm run pm2:logs`
- 重启应用: `npm run pm2:restart`
- 停止应用: `npm run pm2:stop`

## 环境变量

应用使用 `NODE_ENV` 环境变量确定运行环境:
- `local` - 本地开发环境
- `production` - 生产环境
- `unittest` - 单元测试环境

## 文件路径配置

请确保服务器上的文件存储路径存在且有正确的权限。在 `config.ts` 中设置的目录路径需要在服务器上创建。

## MongoDB 设置

确保 MongoDB 服务器已经:
1. 开启身份验证
2. 创建了必要的数据库和用户
3. 配置了适当的网络访问权限

## 故障排除

如果应用无法启动，请检查:
1. 日志文件 - `pm2 logs dana-api`
2. MongoDB 连接 - 确保连接字符串正确
3. 文件权限 - 确保应用有权限访问所需目录
4. 端口占用 - 确保配置的端口未被其他应用占用
