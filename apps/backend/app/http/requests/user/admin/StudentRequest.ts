import FormRequest, { ValidationRules } from '../../../../core/http/Request';
import { User } from '../../../../../database/prisma/client';
import Rule from '../../../../core/validation/Rule';
import Role from '../../../../enums/Role';

class StudentRequest extends FormRequest<User> {
	protected static stopOnFirstFailure: boolean = false;

	protected async rules(): Promise<ValidationRules> {
		const user = await this.routeModel('user');

		return {
			role: Rule.enum(Role).requiredIf(!user).optional(),
			index: Rule.string()
				.excludeIf(Boolean(user))
				.uniqueWithIgnore('user', 'index', user)
				.between(4, 12),
			email: Rule.email().uniqueWithIgnore('user', 'email', user),
			password: Rule.password().confirmed('password').optional(),
			firstName: Rule.string().between(2, 255),
			lastName: Rule.string().between(2, 255),
			parentName: Rule.string().between(2, 255),
			phoneNumber: Rule.phoneNumber().uniqueWithIgnore(
				'user',
				'phoneNumber',
				user,
			),
			address: Rule.string().between(2, 255),
		};
	}

	/**
	 * Hook to modify data after validation.
	 */
	protected transformValidatedData(data: any): any {
		delete data.password_confirmation;

		return data;
	}
}

export default StudentRequest;
