import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-books.dto';
import { AddReviewDto } from './dto/add-review.dto';
import { BadRequestException } from '@nestjs/common';

describe('BooksController', () => {
  let controller: BooksController;
  let service: BooksService;

  const mockBooksService = {
    create: jest.fn((dto, userId) => ({
      ...dto,
      createdBy: userId,
      _id: 'someBookId',
    })),
    addReview: jest.fn((id, review, userId) => ({
      _id: id,
      reviews: [
        {
          ...review,
          userId,
          createdAt: new Date(),
        },
      ],
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: mockBooksService,
        },
      ],
    }).compile();

    controller = module.get<BooksController>(BooksController);
    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createBook', () => {
    it('should create a book', async () => {
      const createBookDto: CreateBookDto = {
        title: 'The Alchemist',
        author: 'Paulo Coelho',
        category: 'Adventure',
        publishedDate: new Date('2021-09-01T00:00:00.000Z'),
      };
      const user: any = {
        email: 'test@example.com',
        id: 'userId',
        iat: 0,
        exp: 0,
      };

      const result = await controller.createBook(createBookDto, user);

      expect(result).toEqual({
        ...createBookDto,
        createdBy: user.id,
        _id: 'someBookId',
      });
      expect(service.create).toHaveBeenCalledWith(createBookDto, user.id);
    });

    it('should throw an error if book creation fails', async () => {
      const createBookDto: CreateBookDto = {
        title: 'The Alchemist',
        author: 'Paulo Coelho',
        category: 'Adventure',
        publishedDate: new Date('2021-09-01T00:00:00.000Z'),
      };
      const user: any = {
        email: 'test@example.com',
        id: 'userId',
        iat: 0,
        exp: 0,
      };

      jest
        .spyOn(service, 'create')
        .mockRejectedValueOnce(new Error('Failed to create book'));

      await expect(controller.createBook(createBookDto, user)).rejects.toThrow(
        'Failed to create book',
      );
    });
  });

  describe('addReviewBook', () => {
    it('should add a review to a book', async () => {
      const addReviewDto: AddReviewDto = {
        comment: 'Great book!',
        rating: 5,
      };
      const user: any = {
        email: 'test@example.com',
        id: 'userId',
        iat: 0,
        exp: 0,
      };
      const bookId = 'someBookId';

      const result = await controller.addReviewBook(bookId, addReviewDto, user);

      expect(result).toEqual({
        _id: bookId,
        reviews: [
          {
            ...addReviewDto,
            userId: user.id,
            createdAt: expect.any(Date),
          },
        ],
      });
      expect(service.addReview).toHaveBeenCalledWith(
        bookId,
        addReviewDto,
        user.id,
      );
    });

    it('should throw an error if adding review fails', async () => {
      const addReviewDto: AddReviewDto = {
        comment: 'Great book!',
        rating: 5,
      };
      const user: any = {
        email: 'test@example.com',
        id: 'userId',
        iat: 0,
        exp: 0,
      };
      const bookId = 'someBookId';

      jest
        .spyOn(service, 'addReview')
        .mockRejectedValueOnce(new BadRequestException('Failed to add review'));

      await expect(
        controller.addReviewBook(bookId, addReviewDto, user),
      ).rejects.toThrow('Failed to add review');
    });
  });
});
