import { Controller, Post, Body, Get, Param, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { GetUser } from './decorators/get-user.decorator';
import { Auth } from './decorators/auth.decorator';
import { UpdateMyAccountDto } from './dto/my-account.dto';
import { User } from 'src/administration/schemas/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async login(@Body() body: AuthDto) {
    return await this.authService.loginUser(body);
  }

  @Get()
  @Auth()
  async verifyAuth(@GetUser() user: User) {
    return await this.authService.checkAuthStatus(user._id);
  }
}
