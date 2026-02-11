export interface CreateExamData {
  courseId: number;
  examPeriodId: number;
  title: string;
  description: string;
  date: Date;
  createdById?: number;
}

export interface UpdateExamData {
  courseId?: number;
  examPeriodId?: number;
  title?: string;
  description?: string;
  date?: Date;
}