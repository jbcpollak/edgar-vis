import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

import { PinoLogger } from 'nestjs-pino';

@Controller('ticker')
export class AppController {
  constructor(
    private readonly logger: PinoLogger,
    private readonly appService: AppService) {}

  @Get(':ticker')
  async getCap(@Param('ticker') ticker: string): Promise<{}> {
    this.logger.debug('loading cap for ticker', ticker);
    return await this.appService.getCap(ticker);
  }
}
