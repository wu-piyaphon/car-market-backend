import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from '@/common/enums/role.enum';
import { UsersService } from '@/users/users.service';
import { SignUpDto } from '@/auth/dto/sign-up.dto';
import { SignInDto } from '@/auth/dto/sign-in.dto';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;
    const foundUser = await this.usersService.findOne(email);

    if (!foundUser) {
      throw new BadRequestException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, foundUser.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload: JwtPayload = { id: foundUser.id, email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(signUpDto: SignUpDto) {
    const { email, password } = signUpDto;
    const foundUser = await this.usersService.findOne(signUpDto.email);

    if (foundUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.usersService.create({
      ...signUpDto,
      password: hashedPassword,
      role: Role.ADMIN,
    });

    const payload: JwtPayload = { id: user.id, email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
