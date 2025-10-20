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
    script: 'npm',
    args: 'run prod',
    cwd: '/home/midway-deploy/apps/dana-api',
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
    exec_mode: 'fork'
  }]
};