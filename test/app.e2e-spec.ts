import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { getModelToken } from '@nestjs/mongoose';
import { AuthService } from '../src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../src/common/schemas/users.schema';
import { Book } from '../src/common/schemas/books.schema';
import { BooksService } from '../src/books/books.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let authService: AuthService;
  let bookService: BooksService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getModelToken(User.name))
      .useValue(jest.fn())
      .overrideProvider(getModelToken(Book.name))
      .useValue(jest.fn())
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    jwtService = moduleFixture.get<JwtService>(JwtService);
    authService = moduleFixture.get<AuthService>(AuthService);
    bookService = moduleFixture.get<BooksService>(BooksService);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('User Registration', () => {
    it('should register a user and return access token', async () => {
      const registerDto = {
        email: 'test@test.com',
        password: 'password',
      };

      const result = { access_token: 'jwt-token' };
      jest.spyOn(authService, 'register').mockResolvedValue(result);

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(201);

      expect(response.body).toEqual(result);
    });

    it('should throw an error if email is not provided', async () => {
      const registerDto = {
        password: 'password',
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(400);
    });

    it('should throw an error if password is not provided', async () => {
      const registerDto = {
        email: 'test@gmail.com',
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(400);
    });

    it('should throw an error if email is invalid', async () => {
      const registerDto = {
        email: 'test',
        password: 'password',
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(400);
    });
  });

  describe('Book Creation', () => {
    it('should create a book', async () => {
      const createBookDto = {
        title: 'The Alchemist',
        author: 'Paulo Coelho',
        category: 'Adventure',
        publishedDate: '2021-09-01T00:00:00.000Z',
      };

      const user = { id: 'user-id', email: 'test@test.com' };
      const token = jwtService.sign(user);

      jest.spyOn(bookService, 'create').mockResolvedValue(createBookDto as any);

      const response = await request(app.getHttpServer())
        .post('/books')
        .set('Authorization', `Bearer ${token}`)
        .send(createBookDto)
        .expect(201);

      expect(response.body.title).toEqual(createBookDto.title);
      expect(response.body.author).toEqual(createBookDto.author);
    });

    it('should throw an error if not title is provided', async () => {
      const createBookDto = {
        author: 'Paulo Coelho',
        category: 'Adventure',
        publishedDate: '2021-09-01T00:00:00.000Z',
      };

      const user = { id: 'user-id', email: 'test@test.com' };
      const token = jwtService.sign(user);

      jest.spyOn(bookService, 'create').mockResolvedValue(createBookDto as any);

      await request(app.getHttpServer())
        .post('/books')
        .set('Authorization', `Bearer ${token}`)
        .send(createBookDto)
        .expect(400);
    });

    it('should throw an error if not author is provided', async () => {
      const createBookDto = {
        title: 'Paulo Coelho',
        category: 'Adventure',
        publishedDate: '2021-09-01T00:00:00.000Z',
      };

      const user = { id: 'user-id', email: 'test@test.com' };
      const token = jwtService.sign(user);

      jest.spyOn(bookService, 'create').mockResolvedValue(createBookDto as any);

      await request(app.getHttpServer())
        .post('/books')
        .set('Authorization', `Bearer ${token}`)
        .send(createBookDto)
        .expect(400);
    });

    it('should create book without category and publishedDate', async () => {
      const createBookDto = {
        title: 'The Alchemist',
        author: 'Paulo Coelho',
      };

      const user = { id: 'user-id', email: 'test@test.com' };
      const token = jwtService.sign(user);

      jest.spyOn(bookService, 'create').mockResolvedValue(createBookDto as any);

      await request(app.getHttpServer())
        .post('/books')
        .set('Authorization', `Bearer ${token}`)
        .send(createBookDto)
        .expect(201);
    });
  });

  describe('Add Review', () => {
    it('should add a review to a book', async () => {
      const addReviewDto = {
        rating: 5,
        comment: 'Great book!',
      };

      const user = { id: 'user-id', email: 'test@test.com' };
      const token = jwtService.sign(user);

      const bookId = 'book-id';

      jest.spyOn(bookService, 'addReview').mockResolvedValue({
        reviews: [
          {
            rating: 5,
            comment: 'Great book!',
          },
        ],
      } as any);

      const response = await request(app.getHttpServer())
        .patch(`/books/${bookId}/review`)
        .set('Authorization', `Bearer ${token}`)
        .send(addReviewDto)
        .expect(200);

      expect(response.body.reviews).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            rating: addReviewDto.rating,
            comment: addReviewDto.comment,
          }),
        ]),
      );
    });
  });
});
