import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { AuthDto } from './dto/auth.dto';
import { CryptoService } from 'src/crypto/crypto.service';
import { ErrorMessages } from 'src/shared/error-messages';
import { User } from 'src/user/user.entity';
import { Tokens } from './interface/tokens.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private cryptoService: CryptoService,
  ) {}

  public async signUp(data: CreateUserDto): Promise<Tokens> {
    const user = await this.usersService.findByEmail(
      data.email,
    );
    if (user) {
      throw new BadRequestException(ErrorMessages.ALREADY_EXIST(User.name));
    }

    const hash = this.cryptoService.encrypt(data.password, data.username);
    const newUser = await this.usersService.create({
      ...data,
      password: hash,
    });
    const tokens = await this.getTokens(newUser.id, newUser.username);
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);
    return tokens;
  }

	public async signIn(data: AuthDto): Promise<Tokens> {
    const user = await this.usersService.findByEmail(data.email);
    if (!user) {
      throw new BadRequestException(ErrorMessages.LOGIN_ERROR);
    }

    const passwordHash = this.cryptoService.decrypt(user.password, user.username);
    if (data.password !== passwordHash) {
      throw new BadRequestException(ErrorMessages.LOGIN_ERROR);
    }

    const tokens = await this.getTokens(user.id, user.username);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

	public async logout(userId: number): Promise<User> {
    return this.usersService.update(userId, { refreshToken: null });
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken) {
      throw new ForbiddenException(ErrorMessages.FORBIDDEN());
    }

    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) {
      throw new ForbiddenException(ErrorMessages.FORBIDDEN());
    }

    const tokens = await this.getTokens(user.id, user.username);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  private hashData(data: string): Promise<string> {
    return argon2.hash(data);
  }

  private async updateRefreshToken(userId: number, refreshToken: string): Promise<void> {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  private async getTokens(userId: number, username: string): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          id: userId,
          username,
        },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: '3m',
        },
      ),
      this.jwtService.signAsync(
        {
          id: userId,
          username,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: '3d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
