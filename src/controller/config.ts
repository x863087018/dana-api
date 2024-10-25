import { Inject, Controller, Post } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { CaptchaService } from '@midwayjs/captcha';
import { Result } from '../define/result';
import { config } from '../config/config'

@Controller('/api/config')
export class configController {
    @Inject()
    ctx: Context;

    @Inject()
    captchaService: CaptchaService;

    @Post('/get-secretKey')
    async getSecretKey(ctx) {
        console.log(ctx.user)
        const crypto = require('crypto');
        const secretKey = crypto.randomBytes(32).toString('hex');
        return Result.OK(secretKey)
    }
    @Post('/get-jwt')
    async getJwt() {
        const jwt = require('jsonwebtoken');
        const payload = {
            id: '1123',
            username: '1123'
        };
        const secretKey = config.secretKey
        const options = { expiresIn: '1h' }; // 设置 token 有效期，例如 1 小时

        return Result.OK(jwt.sign(payload, secretKey, options))
    }
}
