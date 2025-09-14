import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@task-management/constants';
import { Roles } from '@task-management/modules/authentication/decorators/roles.decorator';
import { AuthGuard } from '@task-management/modules/authentication/guards/auth.guard';
import { RolesGuard } from '@task-management/modules/authentication/guards/roles.guard';
import { LoginAccessTokenPayload } from '@task-management/modules/authentication/types/login-token-payload';
import { AuthorizationService } from '@task-management/modules/authorization/authorization.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users/admin')
@UseGuards(AuthGuard, RolesGuard)
export class UsersAdminController {
  private readonly logger = new Logger(UsersAdminController.name);
  constructor(
    private readonly usersService: UsersService,
    private readonly authorizationService: AuthorizationService,
  ) {}

  @Post()
  @Roles([UserRole.SUPER_ADMIN])
  async create(
    @Body() createUserDto: Omit<CreateUserDto, 'roles'>,
  ): Promise<void> {
    try {
      await this.usersService.create({
        ...createUserDto,
        roles: [UserRole.ADMIN],
      });
    } catch (error) {
      if (
        error instanceof HttpException &&
        (error.getStatus() as HttpStatus) === HttpStatus.CONFLICT
      ) {
        throw new ConflictException(error.message);
      }
      this.logger.error('Error creating user:', error);
      throw new InternalServerErrorException(
        'An error occurred while creating the user',
      );
    }
  }

  @Get(':id')
  @Roles([UserRole.ADMIN])
  async findOne(
    @Param('id') id: string,
    @Request() req: { user: LoginAccessTokenPayload },
  ) {
    const canDoIt = this.authorizationService.canViewAndUpdate(
      req.user.sub,
      id,
    );
    if (!canDoIt) {
      throw new HttpException(
        'Forbidden: Admin only view his own information',
        HttpStatus.FORBIDDEN,
      );
    }
    const user = await this.usersService.getUserById(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Patch(':id')
  @Roles([UserRole.ADMIN])
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: { user: LoginAccessTokenPayload },
  ) {
    const canDoIt = this.authorizationService.canViewAndUpdate(
      req.user.sub,
      id,
    );
    if (!canDoIt) {
      throw new HttpException(
        'Forbidden: Admin only update his own information',
        HttpStatus.FORBIDDEN,
      );
    }
    const updatedUser = await this.usersService.update(+id, updateUserDto);
    if (!updatedUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return updatedUser;
  }

  @Delete(':id')
  @Roles([UserRole.SUPER_ADMIN])
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
