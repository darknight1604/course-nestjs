import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSprintDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  createdById: number;
  createdBy?: string;
  teamId: number;
  startDate?: Date;
  endDate?: Date;
}
