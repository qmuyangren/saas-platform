import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, user } = request;

    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;
        const duration = Date.now() - now;

        console.log(
          `[${new Date().toISOString()}] ${method} ${url} ${statusCode} ${duration}ms`,
          {
            user: user ? user.sub : 'anonymous',
            body: this.sanitizeBody(body),
          },
        );
      }),
    );
  }

  private sanitizeBody(body: any): any {
    if (!body) return body;

    const sanitized = { ...body };

    // 移除敏感字段
    const sensitiveFields = ['password', 'secretkey', 'token', 'accessToken', 'refreshToken'];
    sensitiveFields.forEach((field) => {
      if (sanitized[field]) {
        sanitized[field] = '***';
      }
    });

    return sanitized;
  }
}
