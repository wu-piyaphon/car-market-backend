import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { Role } from '@/common/enums/role.enum';
import { UsersService } from '@/users/users.service';
import { SignUpDto } from '@/auth/dto/sign-up.dto';
import { SignInDto } from '@/auth/dto/sign-in.dto';
import { RefreshTokenDto } from '@/auth/dto/refresh-token.dto';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { AUTH_TOKEN_EXPIRES_IN } from '@/config/auth.config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;
    const foundUser = await this.usersService.findOne(email);
    if (!foundUser || !(await bcrypt.compare(password, foundUser.password))) {
      throw new BadRequestException('Invalid email or password');
    }
    return this.generateTokens(foundUser.id, foundUser.email);
  }

  async signUp(signUpDto: SignUpDto) {
    const { email, password } = signUpDto;
    const foundUser = await this.usersService.findOne(email);
    if (foundUser) {
      throw new BadRequestException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({
      ...signUpDto,
      password: hashedPassword,
      role: Role.ADMIN,
    });
    return this.generateTokens(user.id, user.email);
  }

  async refreshToken(dto: RefreshTokenDto) {
    const { refreshToken } = dto;
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Invalid refresh token type');
    }
    const user = await this.usersService.findOne(payload.email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.generateTokens(user.id, user.email);
  }

  private async generateTokens(id: string, email: string) {
    const payload: JwtPayload = { id, email };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: AUTH_TOKEN_EXPIRES_IN.ACCESS,
    });
    const refreshToken = await this.jwtService.signAsync(
      { ...payload, type: 'refresh' },
      { expiresIn: AUTH_TOKEN_EXPIRES_IN.REFRESH },
    );
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
