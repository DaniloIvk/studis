import FormRequest, { ValidationRules } from '../../../../core/http/Request';
import { User } from '../../../../../database/prisma/client';
import Rule from '../../../../core/validation/Rule';
import Role from '../../../../enums/Role';

class ProfessorRequest extends FormRequest<User> {
	protected static stopOnFirstFailure: boolean = false;

	protected async rules(): Promise<ValidationRules> {
		const user = await this.routeModel('user');

		return {
			role: Rule.enum(Role).requiredIf(!user).optional(),
			email: Rule.email().uniqueWithIgnore('user', 'email', user),
			password: Rule.password()
				.requiredIf(Boolean(user))
				.confirmed('password')
				.optional(),
			firstName: Rule.string().between(2, 255),
			lastName: Rule.string().between(2, 255),
			parentName: Rule.string().between(2, 255).optional(),
			phoneNumber: Rule.phoneNumber(),
		};
	}
}

export default ProfessorRequest;
