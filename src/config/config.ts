
export const config = {
    secretKey: "d5e45e56d57d20bfcd44ce01f525f1e7d161eec369f52a9d1ee62a727f08ab8d",
    whiteUrl: ['/api/user/login', '/api/captcha/getImg', '/dana-files','/'],
    // 根据环境自动判断文件存储路径
    dirPath: process.env.NODE_ENV === 'production' 
        ? '/root/dana-files'  // Linux 服务器路径
        : '/Users/huangyingcan/dana-files'  // 本地开发路径
};