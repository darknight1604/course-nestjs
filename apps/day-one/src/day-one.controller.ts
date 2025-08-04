import { Controller, Get } from '@nestjs/common';
import { DayOneService } from './day-one.service';
import { ISampleData } from './types';

@Controller()
export class DayOneController {
  constructor(private readonly dayOneService: DayOneService) {}

  @Get()
  getHello(): string {
    return this.dayOneService.getHello();
  }

  @Get('sample-data')
  getSampleData(): ISampleData[] {
    return this.dayOneService.getSampleData();
  }
}
