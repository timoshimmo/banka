import { Controller, Request, Post, Body } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginDto } from 'src/domain/dto/login.dto';
import { RegisterDto } from 'src/domain/dto/register.dto';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @ApiBody({ type: LoginDto })
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('/register')
  @ApiBody({ type: RegisterDto })
  async register(@Body() user: RegisterDto) {
    return await this.authService.register(user);
  }
}
