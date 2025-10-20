module.exports = {
  apps: [{
    name: 'dana-api',
    script: './bootstrap.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 1123
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 1123
    }
  }]
};
