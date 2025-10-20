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
    proxy: true, // 添加这一行来信任代理头信息
  },
  // WebSocket配置
  ws: {
    // 不设置port，将使用HTTP服务器的端口
    path: '/ws', // WebSocket路径
    cors: {
      origin: '*', // 允许所有来源访问，在生产环境中建议设置为特定域名
      allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
      allowHeaders: 'Content-Type,Authorization',
      credentials: true,
    },
  },
  mongoose: {
    dataSource: {
      default: {
        // uri: 'mongodb://localhost:27017/dana',
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
