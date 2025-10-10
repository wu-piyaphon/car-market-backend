import { AuthService } from '@/auth/auth.service';
import { RefreshTokenDto } from '@/auth/dto/refresh-token.dto';
import { SignInDto } from '@/auth/dto/sign-in.dto';
import { SignUpDto } from '@/auth/dto/sign-up.dto';
import { User } from '@/common/decorators/user.decorator';
import { UserPayload } from '@/common/interfaces/user-payload.interface';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @UseGuards(JwtAuthGuard)
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('refresh')
  refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@User() user: UserPayload) {
    return this.authService.getMe(user.id);
  }
}
