import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNumber()
  @IsNotEmpty()
  createdById: number;

  @IsString()
  createdBy?: string;

  @IsNumber()
  @IsNotEmpty()
  ticketId: number;
}
