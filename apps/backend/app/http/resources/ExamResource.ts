import { ExamPeriod } from 'database/prisma/browser';
import { Exam, User, Course } from '../../../database/prisma/client';
import Resource from '../../core/http/Resource';

type ExamWithRelations = Exam & {
  createdBy?: User | null;
  course?: Course | null;
  examPeriod?: ExamPeriod | null;
};

class ExamResource extends Resource<ExamWithRelations> {
  // Instance property to hold the exam data
  private exam!: ExamWithRelations;

  // Constructor to accept the exam data
  constructor(exam?: ExamWithRelations) {
    super();
    if (exam) {
      this.exam = exam;
    }
  }

  // Implement serialize without parameters
  public serialize() {
    return {
      id: this.exam.id,
      courseId: this.exam.courseId,
      examPeriodId: this.exam.examPeriodId,
      title: this.exam.title,
      description: this.exam.description,
      date: this.exam.date,
      createdById: this.exam.createdById,
      createdBy: this.exam.createdBy ? {
        id: this.exam.createdBy.id,
        firstName: this.exam.createdBy.firstName,
        lastName: this.exam.createdBy.lastName,
        email: this.exam.createdBy.email
      } : null,
      course: this.exam.course ? {
        id: this.exam.course.id,
        name: this.exam.course.name,
        index: this.exam.course.index
      } : null,
      examPeriod: this.exam.examPeriod ? {
        id: this.exam.examPeriod.id,
        name: this.exam.examPeriod.name, 
        dateFrom: this.exam.examPeriod.dateFrom,
        dateTo: this.exam.examPeriod.dateTo
      } : null,
      createdAt: this.exam.createdAt,
      updatedAt: this.exam.updatedAt
    };
  }

  // Static helper methods
  public static make(exam: ExamWithRelations) {
    const resource = new ExamResource(exam);
    return resource.serialize();
  }

  public static collect(exams: ExamWithRelations[]) {
    return exams.map(exam => this.make(exam));
  }
}

export default ExamResource;