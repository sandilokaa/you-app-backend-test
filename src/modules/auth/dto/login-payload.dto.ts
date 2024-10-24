import { ApiProperty } from '@nestjs/swagger';

export class AuthLogin {
  @ApiProperty()
  ownerUser: string;

  @ApiProperty()
  expiredIn: number;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  lastLoggedInAt: Date;
}
