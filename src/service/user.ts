import { App, Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { User } from '../model/user';
import { ReturnModelType } from '@typegoose/typegoose';
import * as koa from '@midwayjs/koa';
@Provide()
export class UserService {
    @InjectEntityModel(User)
    userModel: ReturnModelType<typeof User>;
    @App('koa')
    app: koa.Application;
    async getUser(uid: string, password: string) {
        const res = await this.userModel.findOne({ uid: uid }).lean()
        if (!res) {
            return
        }
        if (res.password !== password) {
            return
        }
        delete res.password
        res.avatar = `http://localhost:${this.app.getConfig('koa').port}/dana-files/${res.avatar}`
        return res
    }
    async getUserInfo(uid: string) {
        const res = await this.userModel.findOne({ uid: uid }).lean()
        if (!res) {
            return
        }
        delete res.password
        res.avatar = `http://localhost:${this.app.getConfig('koa').port}/dana-files/${res.avatar}`
        return res
    }
    async updateUser(uid: string, params: Partial<User>) {
        await this.userModel.updateOne({ uid }, params).lean()
    }
}