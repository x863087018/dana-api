import { Body, Controller, Inject, Post } from '@midwayjs/core';
import { Result } from '../define/result';
import { ApiRecordService } from '../service/api-record';

@Controller('/api/api-record')
export class apiRecordController {

    @Inject()
    apiRecordService: ApiRecordService
    @Post('/get-list')
    async getSecretKey(ctx, @Body('pageSize') pageSize: number, @Body('pageNumber') pageNumber: number) {
        if (!ctx.user || !pageSize || !pageNumber) {
            return Result.error('参数错误')
        }
        const list = await this.apiRecordService.getList(pageSize, pageNumber)
        const total = await this.apiRecordService.accout()
        return Result.OK({ list: list, total })
    }
}