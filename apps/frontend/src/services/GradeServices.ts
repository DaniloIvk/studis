import ApiService from "../core/service/ApiService";

export interface Grade {
    id: number;
    studentId: number;
    examId: number;
    value: number;
    createdById: number | null;
    student: {
        id: number;
        firstName: string;
        lastName: string | null;
        email: string
    } | null;
    exam: {
        id: number;
        title: string;
        date: string;
        course: any;
    } | null;
    createdBy:{
        id: number;
        firstName: string;
        lastName: string | null;
    } | null;
    createdAt: string;
    UpdatedAt: string;
}
class GradeService extends ApiService<Grade>{
    protected static basePath = '/grades';
}

export default new GradeService();