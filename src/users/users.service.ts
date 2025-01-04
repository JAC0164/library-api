import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDoc } from '../common/schemas/users.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(user: User): Promise<UserDoc> {
    const createdUser = new this.userModel(user);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().select('-password').exec();
  }

  async findOne(id: string): Promise<UserDoc> {
    return this.userModel.findById(id).select('-password');
  }

  async update(id: string, user: User): Promise<UserDoc> {
    return this.userModel
      .findByIdAndUpdate(id, user, { new: true })
      .select('-password');
  }

  async remove(id: string): Promise<UserDoc> {
    return this.userModel.findByIdAndDelete(id).select('-password');
  }

  async findOneByEmail(email: string): Promise<UserDoc> {
    return this.userModel.findOne({
      email,
    });
  }
}
