import ApiService from "../core/service/ApiService";
import type { Exam } from "../schema/models";

// export interface Exam {
//     id: number;
//     courseId: number;
//     title: string;
//     description: string;
//     date: string;
//     createdById: number | null;
//     createdBy: {
//         id: number;
//         firstName: string;
//         lastName: string;
//     } | null;
//     course: {
//         id: number;
//         name: string;
//         index: string;
//     } | null;
//     createdAt: string;
//     updatedAt: string;
// }

class ExamService extends ApiService<Exam> {
    protected static basePath = 'api/exams';
}

export default  ExamService;