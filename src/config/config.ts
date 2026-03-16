
export const config = {
    secretKey: "d5e45e56d57d20bfcd44ce01f525f1e7d161eec369f52a9d1ee62a727f08ab8d",
    whiteUrl: ['/api/user/login', '/api/user/wxlogin', '/api/captcha/getImg', '/dana-files','/'],
    // 根据环境自动判断文件存储路径
    dirPath: process.env.DANA_FILES_DIR 
        || (process.env.NODE_ENV === 'production'
            ? (process.platform === 'linux' ? '/root/dana-files' : '/Users/huangyingcan/dana-files')
            : '/Users/huangyingcan/dana-files')
    ,
    wechat: {
        appId: process.env.WX_APPID || '',
        appSecret: process.env.WX_SECRET || ''
    }
};
