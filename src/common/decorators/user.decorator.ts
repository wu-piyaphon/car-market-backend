import { UserPayload } from '@/common/interfaces/user-payload.interface';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator<UserPayload>(
  (_, ctx: ExecutionContext): UserPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
