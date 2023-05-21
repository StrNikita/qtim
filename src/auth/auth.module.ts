import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RefreshTokenStrategy } from './strategy/refresh-token.strategy';
import { AccessTokenStrategy } from './strategy/access-token.strategy';
import { UserModule } from 'src/user/user.module';
import { CryptoModule } from 'src/crypto/crypto.module';

@Module({
  imports: [
    JwtModule.register({}),
    UserModule,
    CryptoModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    RefreshTokenStrategy,
    AccessTokenStrategy,
  ],
})
export class AuthModule {}
