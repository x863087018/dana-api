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
        res.avatar = `/dana-files/${res.avatar}`
        return res
    }
    async getUserInfo(uid: string) {
        const res = await this.userModel.findOne({ uid: uid }).lean()
        if (!res) {
            return
        }
        delete res.password
        res.avatar = `/dana-files/${res.avatar}`
        return res
    }
    async updateUser(uid: string, params: Partial<User>) {
        await this.userModel.updateOne({ uid }, params).lean()
    }
    async getOrCreateWxUser(openid: string, sessionKey?: string, unionid?: string) {
        let res = await this.userModel.findOne({ wxOpenid: openid }).lean()
        if (!res) {
            const doc = await this.userModel.create({
                wxOpenid: openid,
                wxSessionKey: sessionKey,
                wxUnionid: unionid,
                uid: openid,
                name: 'wxuser',
                avatar: ''
            })
            res = doc.toObject()
        } else {
            await this.userModel.updateOne({ _id: res._id }, { wxSessionKey: sessionKey, wxUnionid: unionid }).lean()
        }
        delete res.password
        res.avatar = `/dana-files/${res.avatar}`
        return res
    }
    async listUsersWithPassword() {
        const list = await this.userModel.find({}).lean()
        list.forEach((u: any) => {
            if (u?.avatar) {
                u.avatar = `/dana-files/${u.avatar}`
            }
        })
        return list
    }
}
