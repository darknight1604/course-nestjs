import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateSessionDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @IsString()
  @IsNotEmpty()
  refreshToken: string;

  @IsString()
  @IsNotEmpty()
  ipAddress: string;

  @IsString()
  userAgent: string;

  @IsDate()
  @IsNotEmpty()
  expiredAt: Date;

  @IsBoolean()
  @IsNotEmpty()
  revoked: boolean;

  @IsDate()
  @IsNotEmpty()
  createdDate: Date;

  @IsDate()
  updatedDate: Date;
}
