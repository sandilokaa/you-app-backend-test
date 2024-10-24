import { Injectable } from '@nestjs/common';
import { User } from 'src/database/schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { hashPassword } from 'src/helpers/password.helper';
import { UserAlreadyExistsError } from 'src/errors/ResourceError';
import { RegisterUserDto } from './dto/user-register.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  // Check Duplicate Email
  private async checkDuplicateEmail(options: { email?: string }) {
    if (!options.email) {
      return;
    }

    const existingUser = await this.userModel.findOne({ email: options.email });
    if (existingUser) {
      UserAlreadyExistsError();
    }
  }

  // Register User
  async register(options: RegisterUserDto): Promise<User> {
    await this.checkDuplicateEmail({
      email: options.email,
    });
    const hashedPassword = await hashPassword(options.password);

    const createdUser = new this.userModel({
      ...options,
      password: hashedPassword,
    });

    return createdUser.save();
  }
}
