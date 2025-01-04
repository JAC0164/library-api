import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginRequestDto {
  @IsString()
  @ApiProperty({
    example: 'test@test.com',
    description: 'The email of the user',
  })
  email: string;

  @IsString()
  @ApiProperty({
    example: 'password',
    description: 'The password of the user',
  })
  password: string;
}
