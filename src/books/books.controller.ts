import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-books.dto';
import { UpdateBookDto } from './dto/update-books.dto';
import { User } from '../auth/decorators/user.decorator';
import { AddReviewDto } from './dto/add-review.dto';

interface User {
  email: string;
  id: string;
  iat: number;
  exp: number;
}

@ApiBearerAuth()
@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  @ApiOperation({ summary: 'Get all books' })
  @ApiResponse({ status: 200, description: 'Return all books.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'sortBy', required: false })
  @ApiQuery({ name: 'sortOrder', required: false })
  getBooks(
    @Query('limit') limit: string = '5',
    @Query('page') page: string = '1',
    @Query('sortBy') sortBy: string = 'title',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc',
  ) {
    return this.booksService.findAll({
      limit: parseInt(limit, 10),
      page: parseInt(page, 10),
      sortBy: sortBy,
      sortOrder: sortOrder,
    });
  }

  @Get('top-rated')
  @ApiOperation({ summary: 'Get top books' })
  @ApiResponse({ status: 200, description: 'Return top books.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiQuery({ name: 'limit', required: false })
  getTopBooks(@Query('limit') limit: string = '5') {
    const parsedLimit = parseInt(limit, 10);
    return this.booksService.topBooks(isNaN(parsedLimit) ? 5 : parsedLimit);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search books' })
  @ApiResponse({ status: 200, description: 'Return books.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiQuery({ name: 'title', required: false })
  @ApiQuery({ name: 'author', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'sortBy', required: false })
  @ApiQuery({ name: 'sortOrder', required: false })
  searchBooks(
    @Query('title') title?: string,
    @Query('author') author?: string,
    @Query('category') category?: string,
    @Query('sortBy') sortBy?: 'rating' | 'publishedDate',
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    return this.booksService.searchBooks(
      {
        title: title,
        author: author,
        category: category,
      },
      {
        field: sortBy,
        order: sortOrder,
      },
    );
  }

  @Post()
  @ApiOperation({ summary: 'Create book' })
  @ApiResponse({
    status: 201,
    description: 'The book has been successfully created.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  createBook(@Body() createBookDto: CreateBookDto, @User() user: User) {
    return this.booksService.create(createBookDto, user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get book by id' })
  @ApiResponse({ status: 200, description: 'Return book by id.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getBook(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update book by id' })
  @ApiResponse({ status: 200, description: 'Return book updated.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  updateBook(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete book by id' })
  @ApiResponse({ status: 200, description: 'Return book deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  deleteBook(@Param('id') id: string) {
    return this.booksService.remove(id);
  }

  @Patch(':id/review')
  @ApiOperation({ summary: 'Add review to book' })
  @ApiResponse({ status: 200, description: 'Return book with review.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  addReviewBook(
    @Param('id') id: string,
    @Body() review: AddReviewDto,
    @User() user: User,
  ) {
    return this.booksService.addReview(id, review, user.id);
  }
}
