import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SQL_DATABASE, SQL_HOST, SQL_PASSWORD, SQL_PORT, SQL_TYPE, SQL_USER } from './config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: SQL_TYPE,
      host: SQL_HOST,
      port: SQL_PORT,
      username: SQL_USER,
      password: SQL_PASSWORD,
      database: SQL_DATABASE,
      entities: [`${__dirname}/**/*.entity{.ts,.js}`],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
