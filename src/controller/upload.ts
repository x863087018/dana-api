
import { UploadMiddleware } from '@midwayjs/busboy';
import { Controller, Post, Files, Inject } from '@midwayjs/core';
import { UploadFileInfo } from '@midwayjs/busboy';
import { ReportMiddleware } from '../middleware/report.middleware';
import { UserService } from '../service/user';
@Controller('/api/file')
export class HomeController {
    @Inject()
    userService: UserService

    @Post('/upload-avatar', { middleware: [ReportMiddleware, UploadMiddleware] })
    async upload(ctx, @Files() files: Array<UploadFileInfo>) {

        // ...
        console.log(files)
        console.log(ctx.user)
        //更新用户头像
        await this.userService.updateUser(ctx.user.id, { avatar: `${files[0].data.split('\\')[2]}` })
        return {
            data: '头像上传成功'
        };
    }
}