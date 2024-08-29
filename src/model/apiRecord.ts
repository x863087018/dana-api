import { ModelOptions, prop } from '@typegoose/typegoose';
import { randomIdProfanityFilter } from '../util/util';
@ModelOptions({ schemaOptions: { collection: 'api_record' } })
export class ApiRecord {

    @prop({ default: randomIdProfanityFilter })
    _id: string;


    @prop()
    uid: string;  //账号

    @prop()
    api: string; //url

    @prop()
    ip: string; //调用ip

    @prop()
    result: any; //结果

    @prop()
    rt: number; //耗时
    @prop({ type: Number, default: Date.now })
    createdAt: number;

    @prop({ type: Number, default: Date.now })
    updatedAt: number;
}