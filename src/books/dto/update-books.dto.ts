import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBookDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'The Alchemist',
    description: 'The title of the book',
  })
  title: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Paulo Coelho',
    description: 'The author of the book',
  })
  author: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Adventure',
    description: 'The category of the book',
  })
  category?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '2021-09-01T00:00:00.000Z',
    description: 'Date of publication',
  })
  publishedDate: Date;
}
