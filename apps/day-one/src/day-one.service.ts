import { Injectable } from '@nestjs/common';

@Injectable()
export class DayOneService {
  getHello(): string {
    return 'Hello World!';
  }
}
