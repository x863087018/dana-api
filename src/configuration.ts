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
@Configuration({
  imports: [
    koa,
    validate,
    typegoose,
    {
      component: info,
      enabledEnvironment: ['local'],
    },
    captcha
  ],
  importConfigs: [join(__dirname, './config')],
})
export class MainConfiguration {
  @App('koa')
  app: koa.Application;

  @Config('mongodb')
  mongodbConfig;
  

  @Logger()
  logger: ILogger;
  
  async onReady() {
    // add middleware
    this.app.useMiddleware([ReportMiddleware]);

  }
}
