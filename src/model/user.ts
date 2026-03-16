import { ModelOptions, prop } from '@typegoose/typegoose';
import { randomIdProfanityFilter } from '../util/util';
@ModelOptions({ schemaOptions: { collection: 'user' } })
export class User {

  @prop({ default: randomIdProfanityFilter })
  _id?: string;

  @prop()
  avatar: string //头像地址

  @prop()
  uid: string;  //账号

  @prop()
  name: string; //用户名

  @prop()
  password: string; //密码

  @prop()
  wxOpenid?: string;

  @prop()
  wxUnionid?: string;

  @prop()
  wxSessionKey?: string;

  @prop({ type: Number, default: Date.now })
  createdAt: number;

  @prop({ type: Number, default: Date.now })
  updatedAt: number;
}
