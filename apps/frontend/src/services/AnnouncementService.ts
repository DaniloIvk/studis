import ApiService from '../core/service/ApiService';
import type { ExamPeriod } from '../schema/models';

class AnnouncementService extends ApiService<ExamPeriod> {
	protected static basePath: string = 'api/announcements';
}

export default AnnouncementService;
