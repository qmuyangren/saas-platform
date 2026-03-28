import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class OptionalJwtGuard extends AuthGuard('jwt') implements CanActivate {
  canActivate(context: ExecutionContext): Observable<boolean> | Promise<boolean> | boolean {
    // 先尝试认证，失败也不阻止
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    // 即使认证失败也返回 null，不抛出异常
    return user || null;
  }
}
