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
  HttpException,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { AuthGuard } from '@task-management/modules/authentication/guards/auth.guard';
import { SearchTicketDto } from './dto/search-ticket.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { parse } from 'csv-parse/sync';
import { CsvRecord } from './types';
import { RabbitMQClient } from '@foundation/queue/rabbitmq-client';
import { LoginAccessTokenPayload } from '@task-management/modules/authentication/types/login-token-payload';

@Controller('tickets')
@UseGuards(AuthGuard)
export class TicketsController {
  constructor(
    private readonly ticketsService: TicketsService,
    private readonly rabbitMQClient: RabbitMQClient,
  ) {}

  @Post()
  create(
    @Body() createTicketDto: CreateTicketDto,
    @Request() req: { user: LoginAccessTokenPayload },
  ) {
    return this.ticketsService.create({
      ...createTicketDto,
      createdById: parseInt(req.user.sub, 10),
      createdBy: req.user.username,
    });
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
  async importTickets(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: { user: LoginAccessTokenPayload },
  ) {
    const records: CsvRecord[] = parse(file.buffer.toString('utf-8'), {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    if (records.length === 0) {
      throw new HttpException('CSV file is empty', HttpStatus.BAD_REQUEST);
    }

    const publisher =
      await this.rabbitMQClient.createPublisher('tickets_queue');

    for (const record of records) {
      const message: CreateTicketDto = {
        title: record.Title,
        description: record.Description,
        createdById: parseInt(req.user.sub, 10),
        createdBy: req.user.username,
        assigneeId: record.AssigneeId ? Number(record.AssigneeId) : undefined,
        status: record.Status,
        parentId: record.ParentId ? Number(record.ParentId) : undefined,
        teamId: record.TeamId ? Number(record.TeamId) : undefined,
        sprintId: record.SprintId ? Number(record.SprintId) : undefined,
      };
      void publisher.send(Buffer.from(JSON.stringify(message)));
    }
  }
}
