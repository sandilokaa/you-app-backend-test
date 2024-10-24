import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';

export class UserLoginDto {
  @IsString()
  @ApiProperty()
  readonly username: string;

  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @IsString()
  @ApiProperty()
  readonly password: string;
}
