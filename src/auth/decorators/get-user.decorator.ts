import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';
import { User } from 'src/administration/schemas/user.schema';

// extract user nested by strategy method in request
export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user as User;
    if (!user)
      throw new InternalServerErrorException('User not found (requets)');
    return !data ? user : user[data];
  },
);
