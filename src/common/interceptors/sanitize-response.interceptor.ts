import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { plainToClass } from 'class-transformer';

@Injectable()
export class SanitizeInterceptor implements NestInterceptor {
  constructor(private readonly transformer: any) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    //run something before a request is handled
    return next.handle().pipe(
      map((data: any) => {
        //run something before sent out a request
        return plainToClass(this.transformer, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
