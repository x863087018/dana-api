import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { User } from '../model/user';
import { ReturnModelType } from '@typegoose/typegoose';
@Provide()
export class UserService {
    @InjectEntityModel(User)
    userModel: ReturnModelType<typeof User>;
    async getUser(uid: string, password: string) {
        const res = await this.userModel.findOne({ uid: uid }).lean()
        if (!res) {
            return
        }
        if (res.password !== password) {
            return
        }
        delete res.password
        return res
    }
    async updateUser(uid: string, params: Partial<User>) {
        await this.userModel.updateOne({ uid }, params).lean()
    }
}