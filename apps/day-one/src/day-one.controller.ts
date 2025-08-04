import { Controller, Get } from '@nestjs/common';
import { DayOneService } from './day-one.service';

@Controller()
export class DayOneController {
  constructor(private readonly dayOneService: DayOneService) {}

  @Get()
  getHello(): string {
    return this.dayOneService.getHello();
  }
}
