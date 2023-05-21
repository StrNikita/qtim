import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Tokens } from './interface/tokens.interface';
import { RefreshTokenGuard } from 'src/common/guard/refresh-token.guard';
import { User } from 'src/user/user.entity';
import { AccessTokenGuard } from 'src/common/guard/access-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  public signup(@Body() createUserDto: CreateUserDto): Promise<Tokens> {
    return this.authService.signUp(createUserDto);
  }

  @Post('/signin')
  public signin(@Body() data: AuthDto): Promise<Tokens> {
    return this.authService.signIn(data);
  }

  @UseGuards(AccessTokenGuard)
  @Get('/logout')
  public logout(@Req() req: Request & { user: User }) {
    this.authService.logout(req.user.id);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('/refresh')
  refreshTokens(@Req() req: Request & { user: User }) {
    const userId = req.user.id;
    const refreshToken = req.user.refreshToken;
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
