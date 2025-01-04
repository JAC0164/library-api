import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './users.schema';

export type BookDoc = HydratedDocument<Book>;
export const BookModelName = 'Book';

@Schema({ timestamps: true })
export class Book {
  @Prop({
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 155,
  })
  title: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 155,
  })
  author: string;

  @Prop({
    type: String,
    required: false,
  })
  category: string;

  @Prop([
    raw({
      userId: { type: String, required: true },
      rating: { type: Number, required: true },
      comment: { type: String, required: true },
      createdAt: { type: Date, default: new Date() },
    }),
  ])
  reviews: {
    userId: string;
    rating: number;
    comment: string;
    createdAt: Date;
  }[];

  @Prop({
    type: Date,
    required: false,
  })
  publishedDate: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }) // TODO: Add required: true
  createdBy: User;
}

export const BookSchema = SchemaFactory.createForClass(Book);
