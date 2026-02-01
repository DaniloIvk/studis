import { Prisma } from '../../../../../database/prisma/client';
import { QueryBuilder } from '../../../../core/database/builder/QueryBuilder';
import database from '../../../../core/database/database';
import Controller, {
	ControllerContract,
} from '../../../../core/http/Controller';
import AnnouncementRequest from '../../../requests/announcement/shared/AnnouncementRequest';
import AnnouncementResource from '../../../resources/AnnouncementResource';

class AnnouncementController extends Controller {
	public async index({ request, response }: ControllerContract) {
		const { pagination, data } = await new QueryBuilder<
			Prisma.AnnouncementsGetPayload<true>,
			Prisma.AnnouncementsWhereInput
		>(database.announcements, request)
			.search(['title', 'description'])
			.sortFromRequest(['id', 'title', 'createdAt'])
			.filterDateRangeFromRequest()
			.paginate();

		response.json({ pagination, data: AnnouncementResource.collect(data) });
	}

	public async show({ response, announcement }: ControllerContract) {
		response.json({ data: AnnouncementResource.make(announcement) });
	}

	public async store({ response }: ControllerContract) {
		const request = await AnnouncementRequest.validate();

		const announcement = await database.announcements.create({
			data: request.validated(),
		});

		response.json({
			message: request.t('common:responses.announcement.created'),
			data: AnnouncementResource.make(announcement),
		});
	}

	public async update({ response, announcement }: ControllerContract) {
		const request = await AnnouncementRequest.validate();

		announcement = await database.announcements.update({
			where: { id: announcement.id },
			data: request.validated(),
		});

		response.json({
			message: request.t('common:responses.announcement.updated'),
			data: AnnouncementResource.make(announcement),
		});
	}

	public async destroy({
		request,
		response,
		announcement,
	}: ControllerContract) {
		await database.announcements.delete({ where: { id: announcement.id } });

		response.json({
			message: request.t('common:responses.announcement.deleted'),
		});
	}
}

export default AnnouncementController;
