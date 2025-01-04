import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDoc } from '../common/schemas/books.schema';
import { CreateBookDto } from './dto/create-books.dto';
import { UpdateBookDto } from './dto/update-books.dto';
import { AddReviewDto } from './dto/add-review.dto';

@Injectable()
export class BooksService {
  constructor(@InjectModel(Book.name) private bookModel: Model<Book>) {}

  async create(createBookDto: CreateBookDto, userId: string): Promise<BookDoc> {
    return this.bookModel.create({
      ...createBookDto,
      createdBy: userId,
    });
  }

  async findAll(pagination: {
    limit: number;
    page: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }): Promise<{
    data: Book[];
    pagination: {
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
      nextPage: number;
      prevPage: number;
    };
  }> {
    const skip = (pagination.page - 1) * pagination.limit;

    const count = await this.bookModel.countDocuments();
    const totalPages = Math.ceil(count / pagination.limit);
    const hasNextPage = totalPages > pagination.page;
    const hasPrevPage = pagination.page > 1;
    const nextPage = hasNextPage ? pagination.page + 1 : null;
    const prevPage = hasPrevPage ? pagination.page - 1 : null;

    return {
      data: await this.bookModel
        .find()
        .sort({ [pagination.sortBy]: pagination.sortOrder })
        .skip(skip)
        .limit(pagination.limit)
        .lean(),
      pagination: {
        totalPages,
        hasNextPage,
        hasPrevPage,
        nextPage,
        prevPage,
      },
    };
  }

  async findOne(id: string): Promise<Book> {
    return this.bookModel.findById(id).lean();
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    return this.bookModel
      .findByIdAndUpdate(id, updateBookDto, { new: true })
      .lean();
  }

  async remove(id: string): Promise<Book> {
    return this.bookModel.findByIdAndDelete(id).lean();
  }

  async topBooks(limit = 5): Promise<BookDoc[]> {
    return this.bookModel.aggregate([
      {
        $addFields: {
          averageRating: {
            $ifNull: [{ $avg: '$reviews.rating' }, 0],
          },
        },
      },
      {
        $sort: { averageRating: -1 },
      },
      {
        $limit: limit,
      },
    ]);
  }

  async addReview(
    id: string,
    review: AddReviewDto,
    userId: string,
  ): Promise<Book> {
    const book = await this.bookModel.findById(id);

    if (!book) throw new BadRequestException('Book not found');

    const isUserReviewed = book.reviews.some((r) => r.userId === userId);

    if (isUserReviewed) throw new BadRequestException('You already reviewed');

    return this.bookModel
      .findByIdAndUpdate(
        id,
        {
          $push: {
            reviews: {
              ...review,
              userId,
              createdAt: new Date(),
            },
          },
        },
        { new: true },
      )
      .lean();
  }

  async removeReview(id: string, reviewId: string): Promise<Book> {
    return this.bookModel
      .findByIdAndUpdate(
        id,
        { $pull: { reviews: { _id: reviewId } } },
        { new: true },
      )
      .lean();
  }

  async searchBooks(
    filter: {
      title?: string;
      author?: string;
      category?: string;
    },
    sort: {
      field: 'rating' | 'publishedDate';
      order: 'asc' | 'desc';
    } = { field: 'publishedDate', order: 'asc' },
  ): Promise<BookDoc[]> {
    const query: any = {};

    if (filter.title) {
      query.title = { $regex: filter.title, $options: 'i' };
    }

    if (filter.author) {
      query.author = { $regex: filter.author, $options: 'i' };
    }

    if (filter.category) {
      query.category = { $regex: filter.category, $options: 'i' };
    }

    const sortValue: any =
      sort.field === 'rating'
        ? { averageRating: sort.order === 'asc' ? 1 : -1 }
        : { publishedDate: sort.order === 'asc' ? 1 : -1 };

    return this.bookModel.aggregate([
      { $match: query },
      {
        $addFields: {
          averageRating: {
            $ifNull: [{ $avg: '$reviews.rating' }, 0],
          },
        },
      },
      {
        $sort: sortValue,
      },
    ]);
  }
}
