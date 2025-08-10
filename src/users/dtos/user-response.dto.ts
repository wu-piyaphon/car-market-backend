import { Role } from '@/common/enums/role.enum';
import { User } from '@/users/user.entity';

export class UserResponseDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.role = user.role;
  }
}
