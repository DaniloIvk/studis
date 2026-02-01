import { User } from '../../../../../database/prisma/client';
import { Role } from '../../../../../database/prisma/enums';
import request from '../../../../core/context/request';
import FormRequest from '../../../../core/http/Request';
import { ValidationException } from '../../../../exceptions/ValidationException';
import AdminRequest from './AdminRequest';
import ProfessorRequest from './ProfessorRequest';
import StudentRequest from './StudentRequest';

class UserRequest {
  public static async make(role?: Role): Promise<FormRequest<User>> {
    role ??= this.guessRoleFromRequest();

    if (!role) {
      throw new ValidationException({
        role: ['Role is required!'],
      });
    }

    return await this.makeForRole(role);
  }

  private static async makeForRole(role: Role): Promise<FormRequest<User>> {
    switch (role) {
      case Role.ADMIN:
        return await AdminRequest.validate();
      case Role.PROFESSOR:
        return await ProfessorRequest.validate();
      case Role.STUDENT:
        return await StudentRequest.validate();
    }
  }

  /**
   * Check if request payload has role, and if so use it to return the request
   * defined for that specific role, if no role is detected, fallback to use role.
   *
   * @returns {Role}
   */
  private static guessRoleFromRequest(): Role {
    const requestData = request()?.body ?? {};

    return (requestData['role'] ?? Role.STUDENT) as Role;
  }
}

export default UserRequest;
