import { Module, Global } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_FILTER, APP_PIPE } from '@nestjs/core';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { CustomValidationPipe } from './pipes/custom-validation.pipe';

@Global()
@Module({
  providers: [
    // 全局拦截器
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    // 全局异常过滤器
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    // 全局验证管道
    {
      provide: APP_PIPE,
      useClass: CustomValidationPipe,
    },
  ],
  exports: [],
})
export class CommonModule {}
