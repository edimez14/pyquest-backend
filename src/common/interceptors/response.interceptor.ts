import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  StandardSuccessResponse<T>
> {
  intercept(
    _context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<StandardSuccessResponse<T>> {
    const http = _context.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();

    return next.handle().pipe(
      map((data: T) => ({
        success: true,
        statusCode: response.statusCode,
        path: request.url,
        timestamp: new Date().toISOString(),
        message: 'Solicitud procesada correctamente',
        data,
      })),
    );
  }
}

interface StandardSuccessResponse<T> {
  success: true;
  statusCode: number;
  path: string;
  timestamp: string;
  message: string;
  data: T;
}
