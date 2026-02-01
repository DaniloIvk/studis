import { Prisma } from '../../../../../database/prisma/client';
import { QueryBuilder } from '../../../../core/database/builder/QueryBuilder';
import database from '../../../../core/database/database';
import { transformToNumber } from '../../../../core/helpers/convertType';
import Controller, {
	ControllerContract,
} from '../../../../core/http/Controller';
import CourseRequest from '../../../requests/course/shared/CourseRequest';
import CourseResource from '../../../resources/CourseResource';

class CourseController extends Controller {
	public async getAll({
		request,
		response,
	}: ControllerContract): Promise<void> {
		const data = await new QueryBuilder<
			Prisma.CourseGetPayload<true>,
			Prisma.CourseWhereInput
		>(database.course, request)
			.select(['id', 'name'])
			.get();

		response.json({ data: CourseResource.collect(data) });
	}

	public async index({ request, response }: ControllerContract): Promise<void> {
		const { pagination, data } = await new QueryBuilder<
			Prisma.CourseGetPayload<true>,
			Prisma.CourseWhereInput
		>(database.course, request)
			.include('professor')
			.search(['index', 'name', 'description'])
			.filterInFromRequest('professorId', undefined, transformToNumber)
			.sortFromRequest(['id', 'semester', 'index', 'name', 'espb', 'createdAt'])
			.paginate();

		response.json({ pagination, data: CourseResource.collect(data) });
	}

	public async show({ response, course }: ControllerContract): Promise<void> {
		response.json({ data: CourseResource.make(course) });
	}

	public async store({ response }: ControllerContract): Promise<void> {
		const request = await CourseRequest.validate();
		const course = await database.course.create({ data: request.validated() });

		response.json({
			message: request.t('common:responses.course.created'),
			data: CourseResource.make(course),
		});
	}

	public async update({ response, course }: ControllerContract): Promise<void> {
		const request = await CourseRequest.validate();

		course = await database.course.update({
			where: { id: course.id },
			data: request.validated(),
		});

		response.json({
			message: request.t('common:responses.course.updated'),
			data: CourseResource.make(course),
		});
	}

	public async destroy({
		request,
		response,
		course,
	}: ControllerContract): Promise<void> {
		await database.course.delete({ where: { id: course.id } });

		response.json({ message: request.t('common:responses.course.deleted') });
	}
}

export default CourseController;
