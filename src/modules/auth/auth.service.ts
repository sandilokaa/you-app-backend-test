import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthHelper } from 'src/helpers/auth.helper';
import { UserLoginDto } from './dto/user-login.dto';
import { User } from 'src/database/schemas/user.schema';
import { AuthLogin } from './dto/login-payload.dto';
import { validateHash } from 'src/helpers/password.helper';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { NoUserFoundError, WrongPasswordError } from 'src/errors/ResourceError';
import { TokenPayloadDto } from './dto/token-payload.dto';
import { TokenType } from 'src/types/enum/token-type';

@Injectable()
export class AuthService {
  @Inject(AuthHelper)
  private readonly helper: AuthHelper;

  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  // Validate User
  private async validateUser(validateWith: {
    id?: string;
    username?: string;
    email?: string;
  }): Promise<User | null> {
    const query: any = {};

    if (validateWith.id) {
      query._id = new Types.ObjectId(validateWith.id);
    }

    if (validateWith.username) {
      query.username = validateWith.username;
    }

    if (validateWith.email) {
      query.email = validateWith.email;
    }

    const user: User | null = await this.userModel.findOne(query).exec();
    return user;
  }

  // Login User
  public async login(body: UserLoginDto): Promise<AuthLogin> {
    const { username, email, password } = body;

    const user: User | null = await this.validateUser({
      username: username,
      email: email,
    });

    if (!user) {
      NoUserFoundError();
    }

    const isPasswordValid: boolean = await validateHash(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      WrongPasswordError();
    }

    const token = new TokenPayloadDto();
    token.accessToken = await this.helper.generateToken({
      id: JSON.stringify(user._id),
      type: TokenType.ACCESS_TOKEN,
    });

    const loginPayload = new AuthLogin();
    loginPayload.ownerUser = user.username;
    loginPayload.accessToken = token.accessToken;

    return loginPayload;
  }
}
