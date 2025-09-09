import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSprintDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  createdById: number;

  createdBy?: string;

  @IsNumber()
  @IsNotEmpty()
  teamId: number;

  startDate?: Date;

  endDate?: Date;
}
