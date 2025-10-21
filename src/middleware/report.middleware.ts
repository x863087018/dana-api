import { Middleware, IMiddleware, Inject } from '@midwayjs/core';
import { NextFunction, Context } from '@midwayjs/koa';
import { config } from '../config/config';
import { Result } from '../define/result';
import { ApiRecord } from '../model/api-record';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { ILogger } from '@midwayjs/logger';
const jwt = require('jsonwebtoken');
@Middleware()
export class ReportMiddleware implements IMiddleware<Context, NextFunction> {

  @InjectEntityModel(ApiRecord)
  apiRecordModel: ReturnModelType<typeof ApiRecord>;

  @Inject()
  logger: ILogger;

  resolve() {
    return async (ctx: any, next: NextFunction) => {
      const startTime = Date.now();
      // 使用注入的 logger，会输出到控制台
      this.logger.info(
        `收到请求: "${ctx.request.url}", rt = ${Date.now() - startTime
        }ms ip:${ctx.request.ip}`
      );
      const url = ctx.req.url
      if (!url) {
        return Result.error('url为空')
      }
      //静态资源跳过认证
      let notPublic = true
      if (url.includes('dana-files')) {
        notPublic = false
      }
      //需要身份认证的接口
      if (!config.whiteUrl.includes(url) && notPublic) {
        let token
        try {
          token = ctx.req.headers.authorization.split(' ')[1];
        } catch (e) {
          this.logger.error(`token错误:${e}`)
        }
        if (!token) {
          return Result.identity()
        }
        let verifyRes
        jwt.verify(token, config.secretKey, (err, decoded) => {
          if (err) {
            verifyRes = Result.identity()
          } else {
            ctx.user = decoded; // 将解码后的用户信息存储在请求对象中，方便后续使用
          }

        })
        if (verifyRes) {
          return verifyRes
        }

      }
      // 执行下一个 Web 中间件，最后执行到控制器
      // 这里可以拿到下一个中间件或者控制器的返回值
      const result = await next();
      // 控制器之后执行的逻辑

      if (result === null) {
        ctx.status = 200;
      }
      const clientIP = ctx.request.get('X-Forwarded-For') || 
                ctx.request.get('X-Real-IP') || 
                ctx.request.ip;
      if (url !== '/api/api-record/get-list') {
        await this.apiRecordModel.insertMany([{ api: url, ip: clientIP, rt: Date.now() - startTime, uid: ctx.user?.id, result: result }])
      }
      return result

    };
  }

  static getName(): string {
    return 'report';
  }
}
