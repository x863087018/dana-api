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
}