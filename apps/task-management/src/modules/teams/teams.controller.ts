import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { SearchTeamDto } from './dto/search-team.dto';
import { LoginAccessTokenPayload } from '@task-management/modules/authentication/types/login-token-payload';
import { AuthGuard } from '@task-management/modules/authentication/guards/auth.guard';

@Controller('teams')
@UseGuards(AuthGuard)
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  create(
    @Body() createTeamDto: CreateTeamDto,
    @Request() req: { user: LoginAccessTokenPayload },
  ) {
    return this.teamsService.create({
      ...createTeamDto,
      createdById: parseInt(req.user.sub, 10),
      createdBy: req.user.username,
    });
  }

  @Get()
  findAll(@Query() query: SearchTeamDto) {
    return this.teamsService.search(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamsService.findOne('id', +id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    return this.teamsService.update(+id, updateTeamDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teamsService.remove(+id);
  }
}
