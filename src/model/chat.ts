import { ModelOptions, prop } from '@typegoose/typegoose';
import { randomIdProfanityFilter } from '../util/util';
@ModelOptions({ schemaOptions: { collection: 'chat' } })
export class Chat {

  @prop({ default: randomIdProfanityFilter })
  _id?: string;

  @prop()
  name: string //

  @prop()
  person: any  //账号

  @prop({ type: Number, default: Date.now })
  createdAt: number;

  @prop({ type: Number, default: Date.now })
  updatedAt: number;
}
