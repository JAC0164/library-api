import { ApiProperty } from '@nestjs/swagger';

export class Book {
  @ApiProperty({
    example: 'The Alchemist',
    description: 'The title of the book',
  })
  title: string;

  @ApiProperty({
    example: 'Paulo Coelho',
    description: 'The author of the book',
  })
  author: string;

  @ApiProperty({
    example: 'Adventure',
    description: 'The category of the book',
  })
  category: string;

  @ApiProperty({
    example: [
      {
        userId: '1',
        comment: 'Good book',
        rating: 4,
        createdAt: new Date(),
      },
    ],
    description: 'The reviews of the book',
  })
  reviews: {
    userId: string;
    comment: string;
    rating: number;
    createdAt: Date;
  }[];

  @ApiProperty({
    example: new Date(),
    description: 'The published date of the book',
  })
  publishedDate: Date;
}
