import { MidwayConfig } from '@midwayjs/core';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1712225654823_8287',
  koa: {
    port: 1123,
    hostname: '0.0.0.0',
  },
  mongoose: {
    dataSource: {
      default: {
        uri: 'mongodb://localhost:27017/dana',
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
