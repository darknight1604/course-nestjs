import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { ISampleData } from './types';

@Injectable()
export class DayOneService {
  getHello(): string {
    return 'Hello-world';
  }

  getSampleData(): ISampleData[] {
    try {
      const filePath = path.join(__dirname, 'assets', 'sample.csv');
      const content = fs.readFileSync(filePath, 'utf8');

      return content
        .trim()
        .split('\n')
        .map((item) => this.readContentRow(item));
    } catch (error) {
      console.error('getSampleData failed: ', error);
      return [];
    }
  }

  private readContentRow(value: string): ISampleData {
    const [email, birthday] = value.split(',');

    return { email, birthday };
  }
}
