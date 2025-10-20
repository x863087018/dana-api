import { Configuration, App, Config, Logger } from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import { join } from 'path';
// import { DefaultErrorFilter } from './filter/default.filter';
// import { NotFoundFilter } from './filter/notfound.filter';
import { ReportMiddleware } from './middleware/report.middleware';
import * as captcha from '@midwayjs/captcha';
import * as typegoose from '@midwayjs/typegoose';
import { ILogger } from '@midwayjs/logger';
import * as staticFile from '@midwayjs/static-file';
// import { Connection } from 'mongoose';
import * as busboy from '@midwayjs/busboy';
import * as ws from '@midwayjs/ws';
@Configuration({
  imports: [
    koa,
    validate,
    typegoose,
    {
      component: info,
      enabledEnvironment: ['local'],
    },
    busboy,
    captcha,
    staticFile,
    ws
  ],
  importConfigs: [join(__dirname, './config')],
})
export class MainConfiguration {
  @App('koa')
  app: koa.Application;

  @Config('mongodb')
  mongodbConfig;

  // @Inject()
  // connection: Connection;

  @Logger()
  logger: ILogger;

  async onReady() {
    // add middleware
    this.app.useMiddleware([ReportMiddleware]);
    this.logger.info('启动成功')
    const port = this.app.getConfig('koa').port;
    this.logger.info(`应用正在监听端口 ${port}`);
    // 添加全局错误处理
    this.app.on('error', (err) => {
      this.logger.error('Global error:', err);
    });
    // 检查 MongoDB 连接
    // try {
    //   if (this.connection.readyState === 1) {
    //     this.logger.info('MongoDB connected successfully');
    //   } else {
    //     this.logger.error('MongoDB not connected. Ready state:', this.connection.readyState);
    //   }
    // } catch (error) {
    //   this.logger.error('Error checking MongoDB connection:', error);
    // }
  }
}
