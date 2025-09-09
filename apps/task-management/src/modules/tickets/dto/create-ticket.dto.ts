export class CreateTicketDto {
  title: string;
  description?: string;
  createdById: number;
  createdBy?: string;
  assigneeId?: number;
  status?: string;
  parentId?: number;
  teamId?: number;
  sprintId?: number;
}
