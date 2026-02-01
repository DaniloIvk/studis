import { Prisma, Role } from '../../../../../database/prisma/client';
import { QueryBuilder } from '../../../../core/database/builder/QueryBuilder';
import database from '../../../../core/database/database';
import Controller, {
	ControllerContract,
} from '../../../../core/http/Controller';
import UserRequest from '../../../requests/user/admin/UserRequest';
import UserResource from '../../../resources/UserResource';

class UserController extends Controller {
	public async getAll({
		request,
		response,
	}: ControllerContract): Promise<void> {
		const data = await new QueryBuilder<
			Prisma.UserGetPayload<true>,
			Prisma.UserWhereInput
		>(database.user, request)
			.select(['id', 'firstName', 'lastName', 'parentName'])
			.filterEnumFromRequest('role', Role)
			.get();

		response.json({ data: UserResource.collect(data) });
	}

	public async index({ request, response }: ControllerContract) {
		const { pagination, data } = await new QueryBuilder<
			Prisma.UserGetPayload<true>,
			Prisma.UserWhereInput
		>(database.user, request)
			.search([
				'firstName',
				'lastName',
				'parentName',
				'email',
				'phoneNumber',
				'address',
			])
			.filterEnumInFromRequest('role', Role)
			.sortFromRequest([
				'id',
				'index',
				'firstName',
				'lastName',
				'parentName',
				'email',
				'phoneNumber',
				'address',
				'createdAt',
			])
			.paginate();

		response.json({ pagination: pagination, data: UserResource.collect(data) });
	}

	public show({ response, user }: ControllerContract) {
		response.json(UserResource.make(user));
	}

	public async store({ response }: ControllerContract) {
		const request = await UserRequest.make();
		const message = request.t('common:responses.user.created');

		const user = await database.user.create({ data: request.validated() });

		response.json({ message, data: user });
	}

	public async update({ response, user }: ControllerContract) {
		const request = await UserRequest.make();

		user = await database.user.update({
			where: { id: user.id },
			data: request.validated(),
		});

		const message = request.t('common:responses.user.updated');

		response.json({ message, data: user });
	}

	public async destroy({ request, response, user }: ControllerContract) {
		await database.user.delete({ where: { id: user.id } });

		const message = request.t('common:responses.user.deleted');

		response.json({ message });
	}
}

export default UserController;
