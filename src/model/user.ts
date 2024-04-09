import { ModelOptions, prop } from '@typegoose/typegoose';
import { randomIdProfanityFilter } from '../util/util';
@ModelOptions({ schemaOptions: { collection: 'user' } })
export class User {

  @prop({ default: randomIdProfanityFilter })
  _id?: string;


  @prop()
  uid: string;

  @prop()
  name: string; //云服务名称

  @prop({ type: Number, default: Date.now })
  createdAt: number;

  @prop({ type: Number, default: Date.now })
  updatedAt: number;
}