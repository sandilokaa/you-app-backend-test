import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/database/schemas/user.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { NoUserFoundError } from 'src/errors/ResourceError';

@Injectable()
export class AuthHelper {
  private readonly jwt: JwtService;

  constructor(
    jwt: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {
    this.jwt = jwt;
  }

  // Decoding the JWT
  public async decode(token: string): Promise<unknown> {
    return this.jwt.decode(token, null);
  }

  public async validateUser(payload: any): Promise<User> {
    if (!payload?._id) {
      return null;
    }

    const user: User = await this.userModel
      .findOne({
        _id: Types.ObjectId.createFromHexString(payload._id),
      })
      .exec();

    return user;
  }

  // Generate JWT
  public async generateToken(body: {
    [key: string]: string | number;
  }): Promise<string> {
    return this.jwt.signAsync(body);
  }

  // Validate JWT
  private async validate(token: string): Promise<boolean | null> {
    const decoded: unknown = this.jwt.verify(token);

    if (!decoded) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const user: User = await this.validateUser(decoded);

    if (!user) {
      NoUserFoundError();
    }

    return true;
  }
}
