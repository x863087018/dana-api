module.exports = {
  apps: [
    {
      name: 'dana-api',
      script: './bootstrap.js',
      cwd: '/root/dana-api',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_production: {
        NODE_ENV: 'production',
        MIDWAY_SERVER_ENV: 'production'
      },
      // PM2 日志配置
      error_file: '/home/midway-deploy/logs/dana-api-error.log',
      out_file: '/home/midway-deploy/logs/dana-api-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      // 确保捕获所有输出
      combine_logs: true,
      // 输出日志到控制台
      log_type: 'json'
    }
  ]
};

