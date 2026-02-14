import {
  IsEmail,
  IsString,
  IsEnum,
  MinLength,
  IsOptional,
} from 'class-validator';
import { UserRole } from '../../users/entities/user.entity';

export class CreateAuthDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}
