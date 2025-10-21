// module.exports = {
//   apps: [{
//     name: 'dana-api',
//     script: './bootstrap.js',
//     instances: 1,
//     autorestart: true,
//     watch: false,
//     max_memory_restart: '1G',
//     env: {
//       NODE_ENV: 'production',
//       PORT: 1123
//     },
//     env_production: {
//       NODE_ENV: 'production',
//       PORT: 1123
//     }
//   }]
// };
module.exports = {
  apps: [{
    name: 'dana-api',
    script: './bootstrap.js',
    cwd: '/root/dana-api',
    env: {
      NODE_ENV: 'production',
      PORT: 1123
    },
    error_file: '/home/midway-deploy/logs/dana-api-error.log',
    out_file: '/home/midway-deploy/logs/dana-api-out.log',
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm Z',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    instances: 1,
    exec_mode: 'fork',
    // 确保使用正确的 node 环境
    interpreter: 'node',
    // 设置 NODE_PATH 避免依赖找不到
    env_production: {
      NODE_ENV: 'production',
      PORT: 1123,
      NODE_PATH: '/root/dana-api/node_modules'
    }
  }]
};
