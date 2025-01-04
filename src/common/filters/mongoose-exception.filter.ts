import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { MongoServerError } from 'mongodb';

@Catch(MongoServerError)
export class MongooseExceptionFilter implements ExceptionFilter {
  catch(exception: MongoServerError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'An unexpected database error occurred';

    switch (exception.code) {
      case 11000: // Code pour duplication de clé (exemple: unique key violation)
        status = HttpStatus.CONFLICT;
        message = `Duplicate value detected: ${JSON.stringify(exception.keyValue)}`;
        break;
      case 121: // Code pour les erreurs de validation
        status = HttpStatus.BAD_REQUEST;
        message = exception.message;
        break;
      default:
        message = exception.message;
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
