import { MidwayConfig } from '@midwayjs/core';
import { config } from './config';
const fs = require('fs');
const dirPath = config.dirPath;
// 检查并创建目录
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true }); // 创建目录及其父目录
}
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
  busboy: {
    mode: 'file',
    tmpdir: dirPath,
    cleanTimeout: 0,
  },
  staticFile: {
    dirs: {
      default: {
        prefix: '/dana-files',
        dir: dirPath,
      },
    }
  },
} as MidwayConfig;
