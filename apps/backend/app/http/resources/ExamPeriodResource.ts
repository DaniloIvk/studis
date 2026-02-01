import appConfig from '../../../config/app';
import { formatDate } from '@studis/common';
import { ExamPeriod } from '../../../database/prisma/client';
import Resource from '../../core/http/Resource';

class ExamPeriodResource extends Resource<ExamPeriod> {
	public serialize(): object {
		return {
			id: this.resource.id,
			name: this.resource.name,
			dateFrom: formatDate(this.resource.dateFrom, appConfig.defaultDateFormat),
			dateTo: formatDate(this.resource.dateTo, appConfig.defaultDateFormat),
		};
	}
}

export default ExamPeriodResource;
