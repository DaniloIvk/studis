import FormRequest from '../../../../core/http/Request';
import Rule from '../../../../core/validation/Rule';
import { Announcements } from '../../../../../database/prisma/client';
import currentUser from 'app/core/context/currentUser';

class AnnouncementRequest extends FormRequest<Announcements> {
	protected rules() {
		return {
			title: Rule.string().between(5, 255),
			description: Rule.string().optional(),
			authorId: Rule.integer().exists('user', 'id'),
		};
	}

	protected prepareForValidation(data: Announcements): Announcements {
		data.authorId = currentUser()?.id || 1;

		console.table(data);

		return data;
	}
}

export default AnnouncementRequest;
