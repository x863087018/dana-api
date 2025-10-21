import { Controller, Get } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { User } from '../model/user';
import { ReturnModelType } from '@typegoose/typegoose';

@Controller('/')
export class HomeController {

  @InjectEntityModel(User)
  userModel: ReturnModelType<typeof User>;

  @Get('/')
  async home(): Promise<string> {
    await this.userModel.insertMany([{ uid: 'test', name: 'test' }])
    //  const res: any = this.userModel.find().lean()
    return '请求有效，接口正常';
  }
}
