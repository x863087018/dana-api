import { Controller, Inject, Post } from '@midwayjs/core';
import { Result } from '../define/result';
import { ApiRecordService } from '../service/api-record';

@Controller('/api/api-record')
export class apiRecordController {

    @Inject()
    apiRecordService: ApiRecordService
    @Post('/get-list')
    async getSecretKey(ctx) {
        if (!ctx.req.user) {
            return Result.error('参数错误')
        }
        const list = await this.apiRecordService.getList()

        return Result.OK({ list: list })
    }
}