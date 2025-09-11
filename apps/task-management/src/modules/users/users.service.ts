import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@task-management/core/base.service';
import { PaginationResult } from '@task-management/core/types';
import { buildOrderOptions } from '@task-management/core/utils/pagination-utils';
import * as bcrypt from 'bcrypt';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly configService: ConfigService,
  ) {
    super(userRepo);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.isExistingUser(createUserDto.username);
    if (existingUser) {
      throw new HttpException(
        `User with username ${createUserDto.username} already exists`,
        HttpStatus.CONFLICT,
      );
    }
    const now = new Date();

    const saltRounds = this.configService.get<string>('PASSWORD_ROUNDS', '10');
    const salt = bcrypt.genSaltSync(parseInt(saltRounds));
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    return super.create({
      ...createUserDto,
      password: hashedPassword,
      isActive: true,
      createdDate: now,
      updatedDate: now,
    });
  }

  private async isExistingUser(username: string): Promise<boolean> {
    const user = await this.userRepo.findOne({ where: { username } });
    return !!user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
    return await super.update(id, {
      ...updateUserDto,
      updatedDate: new Date(),
    });
  }

  async search(query: SearchUserDto): Promise<PaginationResult<User>> {
    const { username, isActive, role, orderBy, orderDir, ...rest } = query;
    const orderOptions = buildOrderOptions({ orderBy, orderDir });

    const where: FindOptionsWhere<User> = {};
    if (username !== undefined) where.username = username;
    if (isActive !== undefined) where.isActive = isActive;
    if (role !== undefined) where.roles = `{${role}}`;

    return await this.paginate({
      ...rest,
      order: orderOptions,
      where: Object.keys(where).length > 0 ? where : undefined,
    });
  }
}
