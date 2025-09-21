import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  description?: string;
  createdById?: number;
  createdBy?: string;
  assigneeId?: number;
  status?: string;
  parentId?: number;
  teamId?: number;
  sprintId?: number;
}
