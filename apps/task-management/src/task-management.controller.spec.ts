import { Test, TestingModule } from '@nestjs/testing';
import { TaskManagementController } from './task-management.controller';
import { TaskManagementService } from './task-management.service';

describe('TaskManagementController', () => {
  let taskManagementController: TaskManagementController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TaskManagementController],
      providers: [TaskManagementService],
    }).compile();

    taskManagementController = app.get<TaskManagementController>(
      TaskManagementController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(taskManagementController.getHello()).toBe('Hello World!');
    });
  });
});
