import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';
import { SprintsService } from './sprints.service';
import { AuthGuard } from '@task-management/modules/authentication/guards/auth.guard';
import { LoginAccessTokenPayload } from '@task-management/modules/authentication/types/login-token-payload';
import { SearchSprintDto } from './dto/search-sprint.dto';

@Controller('sprints')
@UseGuards(AuthGuard)
export class SprintsController {
  constructor(private readonly sprintsService: SprintsService) {}

  @Post()
  create(
    @Body() createSprintDto: CreateSprintDto,
    @Request() req: { user: LoginAccessTokenPayload },
  ) {
    return this.sprintsService.create({
      ...createSprintDto,
      createdById: parseInt(req.user.sub, 10),
      createdBy: req.user.username,
    });
  }

  @Get()
  findAll(@Query() query: SearchSprintDto) {
    return this.sprintsService.search(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sprintsService.findOne('id', +id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSprintDto: UpdateSprintDto) {
    return this.sprintsService.update(+id, updateSprintDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sprintsService.remove(+id);
  }
}
