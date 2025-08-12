import { Controller, Get } from '@nestjs/common';
import { TaskManagementService } from './task-management.service';

@Controller()
export class TaskManagementController {
  constructor(private readonly taskManagementService: TaskManagementService) {}

  @Get()
  getHello(): string {
    return this.taskManagementService.getHello();
  }
}
