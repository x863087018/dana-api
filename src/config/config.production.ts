import { MidwayConfig } from '@midwayjs/core';

/**
 * 生产环境配置
 */
export default {
  // 生产环境下的服务器监听端口
  koa: {
    port: 1123, // 可修改为您服务器上想使用的端口
    hostname: '0.0.0.0',
    proxy: true,
  },
  // 生产环境MongoDB配置
  mongoose: {
    dataSource: {
      default: {
        uri: 'mongodb://admin:1123@43.138.147.106:27017/dana?authSource=admin', // 替换为您的MongoDB连接信息
        options: {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        },
        // 关联实体
        entities: ['model']
      }
    }
  },
  // WebSocket配置
  ws: {
    // 使用与HTTP服务器相同的端口
    path: '/ws',
    cors: {
      origin: '*', // 在生产环境中建议限制为特定域名
      allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
      allowHeaders: 'Content-Type,Authorization',
      credentials: true,
    },
  },
} as MidwayConfig;
