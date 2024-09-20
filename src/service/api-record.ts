import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { ApiRecord } from '../model/api-record';
@Provide()
export class ApiRecordService {

    @InjectEntityModel(ApiRecord)
    apiRecordModel: ReturnModelType<typeof ApiRecord>;

    async getList() {
        const res = await this.apiRecordModel.find({}).lean()
        return res
    }
}