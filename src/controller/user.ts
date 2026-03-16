import { Body, Controller, Inject, Post } from '@midwayjs/core';
import { Result } from '../define/result';
import { CaptchaController } from './get-captcha';
import { UserService } from '../service/user';
import { config } from '../config/config';

@Controller('/api/user')
export class userController {
    @Inject()
    captchaController: CaptchaController

    @Inject()
    userService: UserService
    @Post('/login')
    async getSecretKey(@Body('id') id: string, @Body('answer') answer: string, @Body('uid') uid: string, @Body('password') password: string) {
        if (!uid || !id || !answer || !password) {
            return Result.error('参数错误')
        }
        const check = await this.captchaController.checkImg(id, answer)
        if (!check) {
            return Result.error('验证码错误')
        }
        const user = await this.userService.getUser(uid, password)
        if (!user) {
            return Result.error('账号或密码错误')
        }
        const jwt = require('jsonwebtoken');
        const payload = {
            id: uid,
            username: password
        };
        const secretKey = config.secretKey
        const options = { expiresIn: '1h' }; // 设置 token 有效期，例如 1 小时

        return Result.OK({ user: user, token: jwt.sign(payload, secretKey, options) })
    }
    @Post('/wxlogin')
    async wxLogin(@Body('code') code: string) {
        if (!code) {
            return Result.error('参数错误')
        }
        if (!config.wechat.appId || !config.wechat.appSecret) {
            return Result.error('未配置微信参数')
        }
        const https = require('https')
        const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${config.wechat.appId}&secret=${config.wechat.appSecret}&js_code=${code}&grant_type=authorization_code`
        const res: any = await new Promise((resolve, reject) => {
            https.get(url, (resp) => {
                let data = ''
                resp.on('data', (chunk) => {
                    data += chunk
                })
                resp.on('end', () => {
                    try {
                        resolve(JSON.parse(data))
                    } catch (e) {
                        reject(e)
                    }
                })
            }).on('error', (err) => {
                reject(err)
            })
        })
        if (!res || res.errcode) {
            return Result.error('微信登录失败')
        }
        const user = await this.userService.getOrCreateWxUser(res.openid, res.session_key, res.unionid)
        const jwt = require('jsonwebtoken');
        const payload = {
            id: user.uid,
            username: user.name
        };
        const secretKey = config.secretKey
        const options = { expiresIn: '1h' };
        return Result.OK({ user: user, wechat: { openid: res.openid, session_key: res.session_key, unionid: res.unionid }, token: jwt.sign(payload, secretKey, options) })
    }
    @Post('/list-with-password')
    async listWithPassword() {
        const list = await this.userService.listUsersWithPassword()
        return Result.OK(list)
    }
}
