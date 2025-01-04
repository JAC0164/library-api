import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BookModelName, BookSchema } from '../common/schemas/books.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: BookModelName, schema: BookSchema }]),
  ],
  providers: [BooksService],
  controllers: [BooksController],
})
export class BooksModule {}
