import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { AuthGuard } from '@task-management/modules/authentication/guards/auth.guard';
import { SearchTicketDto } from './dto/search-ticket.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { parse } from 'csv-parse/sync';
import { CsvRecord } from './types';

@Controller('tickets')
@UseGuards(AuthGuard)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketsService.create(createTicketDto);
  }

  @Get()
  findAll(@Query() query: SearchTicketDto) {
    return this.ticketsService.search(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketsService.findOne('id', +id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketsService.update(+id, updateTicketDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(+id);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  importTickets(@UploadedFile() file: Express.Multer.File) {
    const records = parse(file.buffer.toString('utf-8'), {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    const tickets = records.map((record: CsvRecord) => {
      return {
        title: record.Title,
        description: record.Description,
        createdById: Number(record.CreatedById),
        createdBy: record.CreatedBy,
        assigneeId: record.AssigneeId ? Number(record.AssigneeId) : undefined,
        status: record.Status,
        parentId: record.ParentId ? Number(record.ParentId) : undefined,
        teamId: record.TeamId ? Number(record.TeamId) : undefined,
        sprintId: record.SprintId ? Number(record.SprintId) : undefined,
      } as CreateTicketDto;
    });
    console.log(tickets);
    // return createdTickets;
  }
}
