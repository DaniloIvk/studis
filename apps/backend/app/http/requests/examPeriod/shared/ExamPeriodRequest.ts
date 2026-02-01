import FormRequest from '../../../../core/http/Request';
import Rule from '../../../../core/validation/Rule';
import { ExamPeriod } from '../../../../../database/prisma/client';

class ExamPeriodRequest extends FormRequest<ExamPeriod> {
  protected rules() {
    return {
      name: Rule.string().between(3, 255),
      dateFrom: Rule.date(),
      dateTo: Rule.date(),
    };
  }
}

export default ExamPeriodRequest;
