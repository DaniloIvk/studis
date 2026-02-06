export interface CreateExamData {
  courseId: number;
  title: string;
  description: string;
  date: Date;
  createdById?: number;
}

export interface UpdateExamData {
  courseId?: number;
  title?: string;
  description?: string;
  date?: Date;
}