import { MidwayConfig } from '@midwayjs/core';

/**
 * 本地开发环境配置
 */
export default {
  // 本地环境下的服务器监听端口
  koa: {
    port: 1123,
    hostname: '0.0.0.0',
    proxy: true,
  },
  // 本地环境MongoDB配置
  mongoose: {
    dataSource: {
      default: {
        uri: 'mongodb://admin:1123@43.138.147.106:27017/dana?authSource=admin',
        options: {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        },
        // 关联实体
        entities: ['model']
      }
    }
  },
} as MidwayConfig;
