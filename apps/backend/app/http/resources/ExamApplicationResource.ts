import { ExamApplication } from '../../../database/prisma/client';
import Resource from '../../core/http/Resource';

class ExamApplicationResource extends Resource<ExamApplication> {
  public serialize(): object {
    return {
      id: this.resource.id,
      examPeriodId: this.resource.examPeriodId,
      courseId: this.resource.courseId,
      studentId: this.resource.studentId,
      status: this.resource.status,
      grade: this.resource.grade,
      gradedAt: this.resource.gradedAt,
    };
  }
}

export default ExamApplicationResource;
