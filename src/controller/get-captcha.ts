import { Inject, Controller, Post, Body } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { CaptchaService } from '@midwayjs/captcha';
import { Result } from '../define/result';
@Controller('/api/captcha')
export class CaptchaController {
  @Inject()
  ctx: Context;


  @Inject()
  captchaService: CaptchaService;

  @Post('/getImg')
  async getImg() {
    const { id, imageBase64 } = await this.captchaService.image({ width: 120, height: 40 });
    return Result.OK({
      id,          // 验证码 id
      imageBase64, // 验证码 SVG 图片的 base64 数据，可以直接放入前端的 img 标签内
    })
  }
  @Post('/checkCaptcha')
  async checkImg(@Body('id') id: string, @Body('answer') answer: string) {
    if (!id || !answer) {
      return 0
    }
    const passed: boolean = await this.captchaService.check(id, answer);
    return passed

  }

}
