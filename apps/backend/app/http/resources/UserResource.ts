import { User } from '../../../database/prisma/client';
import Resource from '../../core/http/Resource';

class UserResource extends Resource<User> {
  public serialize(): object {
    return {
      id: this.resource.id,
      role: this.resource.role,
      index: this.resource.index,
      firstName: this.resource.firstName,
      parentName: this.resource.parentName,
      lastName: this.resource.lastName,
      fullName: this.fullName(),
      email: this.resource.email,
      phoneNumber: this.resource.phoneNumber,
      address: this.resource.address,
      createdAt: this.resource.createdAt,
    } as const;
  }

  private fullName(): string | undefined {
    if (!('firstName' in this.resource)) {
      return undefined;
    }

    let name = this.resource.firstName;

    if (
      'parentName' in this.resource &&
      typeof this.resource.parentName === 'string' &&
      this.resource.parentName.length > 0
    ) {
      name += ` ${this.resource.parentName.charAt(0)}.`;
    }

    if (
      'lastName' in this.resource &&
      typeof this.resource.lastName === 'string' &&
      this.resource.lastName.length > 0
    ) {
      name += ` ${this.resource.lastName}`;
    }

    return name;
  }
}

export default UserResource;
