const { Bootstrap } = require('@midwayjs/bootstrap');

Bootstrap.configure({
  appDir: __dirname,
  // 如果在根目录运行，使用 dist 目录
  baseDir: __dirname + '/dist',
  // 如果直接在 dist 目录运行，注释掉上面一行
  // baseDir: __dirname,
}).run().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
