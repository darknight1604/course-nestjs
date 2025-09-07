import { Reflector } from '@nestjs/core';
import { UserRole } from '@task-management/constants';

export const Roles = Reflector.createDecorator<UserRole[]>();
