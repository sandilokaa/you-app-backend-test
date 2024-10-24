import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional } from 'class-validator';

export class UserLoginDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  username?: string;

  @IsOptional()
  @ApiProperty()
  @IsEmail()
  email?: string;

  @IsString()
  @ApiProperty()
  password: string;
}
