import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@task-management/modules/authentication/guards/auth.guard';
import { SearchUserDto } from './dto/search-user.dto';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<void> {
    try {
      await this.usersService.create(createUserDto);
    } catch (error) {
      if (
        error instanceof HttpException &&
        (error.getStatus() as HttpStatus) === HttpStatus.CONFLICT
      ) {
        throw new ConflictException(error.message);
      }
      console.error('Error creating user:', error);
      throw new InternalServerErrorException(
        'An error occurred while creating the user',
      );
    }
  }

  @Get()
  findAll(@Query() query: SearchUserDto) {
    return this.usersService.search(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne('id', +id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.usersService.update(+id, updateUserDto);
    if (!updatedUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return updatedUser;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
