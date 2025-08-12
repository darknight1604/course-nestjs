import { Injectable } from '@nestjs/common';

@Injectable()
export class TaskManagementService {
  getHello(): string {
    return 'Hello World! - Task management';
  }
}
