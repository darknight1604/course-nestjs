import { Module } from '@nestjs/common';
import { DayOneController } from './day-one.controller';
import { DayOneService } from './day-one.service';

@Module({
  imports: [],
  controllers: [DayOneController],
  providers: [DayOneService],
})
export class DayOneModule {}
