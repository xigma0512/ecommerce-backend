import { UserRole } from '../../users/entities/user.entity';

export class CreateAuthDto {
  email: string;
  password: string;
  role?: UserRole;
}
