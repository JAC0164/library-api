import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface AppResponse<T> {
  data: T;
  statusCode: number;
  timestamp: string;
  pagination?: {
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number;
    prevPage: number;
  };
}

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const res: AppResponse<any> = {
          data: data?.data ? data?.data : data,
          statusCode: context.switchToHttp().getResponse().statusCode,
          timestamp: new Date().toISOString(),
        };

        if (data?.pagination) res.pagination = data?.pagination;

        return res;
      }),
    );
  }
}
