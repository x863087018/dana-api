import { Middleware, IMiddleware } from '@midwayjs/core';
import { NextFunction, Context } from '@midwayjs/koa';
import { config } from '../config/config';
import { Result } from '../define/result';
const jwt = require('jsonwebtoken');
@Middleware()
export class ReportMiddleware implements IMiddleware<Context, NextFunction> {
  resolve() {
    return async (ctx: any, next: NextFunction) => {
      const url = ctx.req.url
      if (!url) {
        return Result.error('url为空')
      }
      //需要身份认证的接口
      if (!config.whiteUrl.includes(url)) {
        let token
        try {
          token = ctx.req.headers.authorization.split(' ')[1];
        } catch (e) {
          ctx.logger.error(`token错误:${e}`)
        }
        if (!token) {
          return Result.error('身份验证失败')
        }
        let verifyRes
        jwt.verify(token, config.secretKey, (err, decoded) => {
          if (err) {
            verifyRes = Result.error('身份验证失败')
          }
          ctx.req.user = decoded; // 将解码后的用户信息存储在请求对象中，方便后续使用
        })
        if (verifyRes) {
          return verifyRes
        }

      }
      // 控制器前执行的逻辑
      const startTime = Date.now();
      // 执行下一个 Web 中间件，最后执行到控制器
      // 这里可以拿到下一个中间件或者控制器的返回值
      const result = await next();
      // 控制器之后执行的逻辑
      ctx.logger.info(
        `Report "${ctx.request.url}", rt = ${Date.now() - startTime
        }ms ip:${ctx.request.ip}`
      );
      if (result === null) {
        ctx.status = 200;
      }
      return result

    };
  }

  static getName(): string {
    return 'report';
  }
}
