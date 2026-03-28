import {
  ArgumentMetadata,
  BadRequestException,
  ValidationPipe,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class CustomValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (!value || typeof value !== 'object') {
      return value;
    }

    const { metatype } = metadata;
    if (!metatype) {
      return value;
    }

    const object = plainToInstance(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const errorMessages = errors
        .map((error) => {
          const constraints = error.constraints;
          if (constraints) {
            return Object.values(constraints).join(', ');
          }
          return `${error.property} is invalid`;
        })
        .join('; ');

      throw new BadRequestException({
        code: 'VALIDATION_ERROR',
        message: '参数验证失败',
        errors: errorMessages,
      });
    }

    return object;
  }
}
