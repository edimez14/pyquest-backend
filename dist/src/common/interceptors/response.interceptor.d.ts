import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare class ResponseInterceptor<T> implements NestInterceptor<T, StandardSuccessResponse<T>> {
    intercept(_context: ExecutionContext, next: CallHandler<T>): Observable<StandardSuccessResponse<T>>;
}
interface StandardSuccessResponse<T> {
    success: true;
    statusCode: number;
    path: string;
    timestamp: string;
    message: string;
    data: T;
}
export {};
