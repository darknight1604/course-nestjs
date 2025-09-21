export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  username: string;
  roles?: string[];
};
