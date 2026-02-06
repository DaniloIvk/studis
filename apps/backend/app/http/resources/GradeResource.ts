import { Grade, User, Exam } from '../../../database/prisma/client';
import Resource from '../../core/http/Resource';

type GradeWithRelations = Grade & {
  student?: User | null;
  exam?: (Exam & { course?: any }) | null;
  createdBy?: User | null;
};

class GradeResource extends Resource<GradeWithRelations> {
  private grade!: GradeWithRelations;

  constructor(grade?: GradeWithRelations) {
    super();
    if (grade) {
      this.grade = grade;
    }
  }

  public serialize() {
    return {
      id: this.grade.id,
      studentId: this.grade.studentId,
      examId: this.grade.examId,
      value: this.grade.value,
      createdById: this.grade.createdById,
      student: this.grade.student ? {
        id: this.grade.student.id,
        firstName: this.grade.student.firstName,
        lastName: this.grade.student.lastName,
        email: this.grade.student.email
      } : null,
      exam: this.grade.exam ? {
        id: this.grade.exam.id,
        title: this.grade.exam.title,
        date: this.grade.exam.date,
        course: this.grade.exam.course
      } : null,
      createdBy: this.grade.createdBy ? {
        id: this.grade.createdBy.id,
        firstName: this.grade.createdBy.firstName,
        lastName: this.grade.createdBy.lastName
      } : null,
      createdAt: this.grade.createdAt,
      updatedAt: this.grade.updatedAt
    };
  }

  public static make(grade: GradeWithRelations) {
    const resource = new GradeResource(grade);
    return resource.serialize();
  }

  public static collect(grades: GradeWithRelations[]) {
    return grades.map(grade => this.make(grade));
  }
}

export default GradeResource;