import * as path from 'path';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino'

import { AppController } from './app.controller';
import { AppService } from './app.service';

export const root: string = path.resolve(__dirname, "..")

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: `${root}/data/edgar.sqlite`,
      entities: ['dist/**/*.entity{.ts,.js}'],
    }),
    LoggerModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
