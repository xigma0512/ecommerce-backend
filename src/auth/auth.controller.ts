import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() body: CreateAuthDto) {
    return this.authService.signup(body.email, body.password, body.role);
  }

  @Post('login')
  login(@Body() body: LoginAuthDto) {
    return this.authService.login(body.email, body.password);
  }
}
