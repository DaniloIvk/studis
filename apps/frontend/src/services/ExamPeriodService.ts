import ApiService from '../core/service/ApiService';
import type { ExamPeriod } from '../schema/models';

class ExamPeriodService extends ApiService<ExamPeriod> {
	protected static basePath: string = 'api/exam-periods';
}

export default ExamPeriodService;
