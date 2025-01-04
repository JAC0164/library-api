import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Max, Min } from 'class-validator';

export class AddReviewDto {
  @IsString()
  @ApiProperty({
    example: 'Good book',
    description: 'The comment of the review',
  })
  comment: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  @ApiProperty({
    example: 5,
    description: 'The rating of the book',
  })
  rating: number;
}
