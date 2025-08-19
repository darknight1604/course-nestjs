import { Injectable } from '@nestjs/common';
import { BaseService } from '../../../core/base.service';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {
    super(userRepo);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const now = new Date();
    return super.create({
      ...createUserDto,
      isActive: true,
      createdDate: now,
      updatedDate: now,
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
    return await super.update(id, {
      ...updateUserDto,
      updatedDate: new Date(),
    });
  }
}
