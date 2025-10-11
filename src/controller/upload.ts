import { UploadMiddleware } from '@midwayjs/busboy';
import { Controller, Post, Inject, Files, Fields, App } from '@midwayjs/core';
import { UploadFileInfo } from '@midwayjs/busboy';
import { ReportMiddleware } from '../middleware/report.middleware';
import { UserService } from '../service/user';
import { Result } from '../define/result';
import * as fs from 'fs';
import * as path from 'path';
import * as koa from '@midwayjs/koa';
import { config } from '../config/config';

@Controller('/api/file')
export class HomeController {
  @Inject()
  userService: UserService;
  
  @App('koa')
  app: koa.Application;

  @Post('/upload-avatar', { middleware: [ReportMiddleware, UploadMiddleware] })
  async upload(
    ctx,
    @Files() files: Array<UploadFileInfo>,
    @Fields() fields: Record<string, any>
  ) {
    console.log('上传的文件:', files);
    console.log('表单字段:', fields);
    console.log(ctx.user);
    
    if (files && files.length > 0) {
      const file = files[0];
      // 获取文件原始名称和扩展名
      const originalName = file.filename;
      const ext = path.extname(originalName);
      
      // 创建唯一文件名
      const uniqueFileName = `avatar_${ctx.user.id}_${Date.now()}${ext}`;
      
      // 源文件路径和目标文件路径
      const sourcePath = file.data;
      const targetPath = path.join(
        config.dirPath,
        uniqueFileName
      );
      
      // 复制文件到目标位置
      try {
        // 如果源文件和目标文件不在同一个位置，进行复制
        if (sourcePath !== targetPath) {
          fs.copyFileSync(sourcePath, targetPath);
          console.log(`文件保存成功: ${targetPath}`);
        }
        
        // 更新用户头像信息（只存储文件名，不包含路径）
        await this.userService.updateUser(ctx.user.id, {
          avatar: uniqueFileName,
        });
      } catch (err) {
        console.error('文件保存失败:', err);
        return Result.error('头像上传失败');
      }
    }
    
    if (fields && fields.name) {
      // 更新用户名字
      await this.userService.updateUser(ctx.user.id, { name: fields.name });
    }
    
    const userInfo = await this.userService.getUserInfo(ctx.user.id);
    return Result.OK(userInfo);
  }
}