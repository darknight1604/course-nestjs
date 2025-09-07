import { UserRole } from '@task-management/constants';

export type LoginAccessTokenPayload = {
  sub: string;
  username: string;
  roles: UserRole[];
};
