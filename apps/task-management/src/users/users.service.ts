import { Injectable } from '@nestjs/common';
import { BaseService } from '../core/base.service';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {
    super(userRepo);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    return super.create({
      ...createUserDto,
      isActive: true,
      createdDate: new Date(),
    });
  }
}
