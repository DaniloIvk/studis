export interface CreateGradeData {
  studentId: number;
  examId: number;
  value: number;
  createdById?: number;
}

export interface UpdateGradeData {
  value: number;
}