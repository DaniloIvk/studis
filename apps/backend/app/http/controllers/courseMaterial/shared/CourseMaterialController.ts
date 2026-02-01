import { Prisma } from '../../../../../database/prisma/client';
import { unlink } from 'node:fs';
import { QueryBuilder } from '../../../../core/database/builder/QueryBuilder';
import { logErrors } from '../../../../core/logging/helpers';
import database from '../../../../core/database/database';
import Controller, {
	ControllerContract,
} from '../../../../core/http/Controller';
import CourseMaterialRequest from '../../../requests/courseMaterial/shared/CourseMaterialRequest';
import CourseMaterialResource from '../../../resources/CourseMaterialResource';

class CourseMaterialController extends Controller {
	public async index({ request, response }: ControllerContract) {
		const { pagination, data } = await new QueryBuilder<
			Prisma.CourseMaterialGetPayload<true>,
			Prisma.CourseMaterialWhereInput
		>(database.courseMaterial, request)
			.search(['title', 'description', 'filename'])
			.filterDateRangeFromRequest('createdAt', 'createdAt')
			.sortFromRequest(['id', 'title', 'createdAt'])
			.paginate();

		response.json({ pagination, data: CourseMaterialResource.collect(data) });
	}

	public async show({ response, courseMaterial }: ControllerContract) {
		response.json({ data: CourseMaterialResource.make(courseMaterial) });
	}

	public async store({ response }: ControllerContract) {
		const request = await CourseMaterialRequest.validate();
		const courseMaterial = await database.courseMaterial.create({
			data: request.validated(),
		});

		response.json({
			message: request.t('common:responses.course_material.created'),
			data: CourseMaterialResource.make(courseMaterial),
		});
	}

	public async update({ response, courseMaterial }: ControllerContract) {
		const request = await CourseMaterialRequest.validate();

		const oldFilepath = courseMaterial.filepath;

		courseMaterial = await database.courseMaterial.update({
			where: { id: courseMaterial.id },
			data: request.validated(),
		});

		if (oldFilepath && oldFilepath !== courseMaterial.filepath) {
			unlink(oldFilepath, logErrors);
		}

		response.json({
			message: request.t('common:responses.course_material.updated'),
			data: CourseMaterialResource.make(courseMaterial),
		});
	}

	public async destroy({
		request,
		response,
		courseMaterial,
	}: ControllerContract) {
		await database.courseMaterial.delete({ where: { id: courseMaterial.id } });

		response.json({
			message: request.t('common:responses.course_material.deleted'),
		});
	}
}

export default CourseMaterialController;
