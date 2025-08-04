import { Test, TestingModule } from '@nestjs/testing';
import { DayOneController } from './day-one.controller';
import { DayOneService } from './day-one.service';

describe('DayOneController', () => {
  let dayOneController: DayOneController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [DayOneController],
      providers: [DayOneService],
    }).compile();

    dayOneController = app.get<DayOneController>(DayOneController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(dayOneController.getHello()).toBe('Hello World!');
    });
  });
});
