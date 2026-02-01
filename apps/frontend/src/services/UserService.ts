import ApiService from '../core/service/ApiService';
import Role from '../enums/Role';
import type { User } from '../schema/models';

class UserService extends ApiService<User> {
	protected static basePath: string = 'api/users';

	public async getAllProfessors(): Promise<Partial<User>> {
		const response = await this.fetch(`${UserService.basePath}/all`, 'GET', {
			role: Role.PROFESSOR.value,
		});

		return response as Promise<Partial<User>>;
	}
}

export default UserService;
