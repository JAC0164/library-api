import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterRequestDto {
  @IsString()
  @IsEmail()
  @ApiProperty({
    example: 'test@test.com',
    description: 'The email of the user',
  })
  email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({
    example: 'password',
    description: 'The password of the user',
  })
  password: string;
}
