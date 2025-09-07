import { IsNotEmpty, IsNumber } from 'class-validator';

export class LogoutDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
