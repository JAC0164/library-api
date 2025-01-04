import { MongooseModule } from '@nestjs/mongoose';

export const DbConfigModule = MongooseModule.forRoot(
  'mongodb+srv://charo164:charo2002@cluster0.zcti7.mongodb.net/books-db?retryWrites=true&w=majority',
  {},
);
