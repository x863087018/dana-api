import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { ApiRecord } from '../model/api-record';
@Provide()
export class ApiRecordService {

    @InjectEntityModel(ApiRecord)
    apiRecordModel: ReturnModelType<typeof ApiRecord>;

    async getList(pageSize: number, pageNumber: number) {
        const res = await this.apiRecordModel
            .find({})
            .sort({ createdAt: -1 }) // 降序排序
            .skip((pageNumber - 1) * pageSize) // 跳过前面几条记录
            .limit(pageSize) // 限制返回的记录数量
            .lean();
        return res;
    }
    async accout() {
        const res = await this.apiRecordModel.countDocuments({})
        return res;
    }
}