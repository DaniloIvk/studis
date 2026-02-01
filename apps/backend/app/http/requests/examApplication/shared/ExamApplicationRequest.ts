import FormRequest from '../../../../core/http/Request';
import Rule from '../../../../core/validation/Rule';
import { ExamApplication } from '../../../../../database/prisma/client';

class ExamApplicationRequest extends FormRequest<ExamApplication> {
  protected rules() {
    return {
      examPeriodId: Rule.integer().exists('examPeriod', 'id'),
      courseId: Rule.integer().exists('course', 'id'),
      studentId: Rule.integer().exists('user', 'id'),
      status: Rule.string().optional(),
      grade: Rule.number().min(5).max(10).optional(),
      gradedAt: Rule.date().optional(),
    };
  }
}

export default ExamApplicationRequest;
