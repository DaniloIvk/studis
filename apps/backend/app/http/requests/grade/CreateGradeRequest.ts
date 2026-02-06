import { z } from 'zod'
import FormRequest from "../../../core/http/Request"
import { currentUser } from '../../../core/helpers/currentUser'

const CreateGradeSchema = z.object({
    studentId: z.number().int().positive(),
    examId: z.number().int().positive(),
    value: z.number().min(5).max(10)
});

type CreateGradeData = z.infer<typeof CreateGradeSchema>;

class CreateGradeRequest extends FormRequest {
    protected rules() {
        return CreateGradeSchema.shape;
    }

    protected transformValidatedData(data: any): CreateGradeData & { createdById: number | undefined } {
        const user = currentUser();
        
        // Ensure user is professor or admin
        if (user?.role !== 'PROFESSOR' && user?.role !== 'ADMIN') {
            throw new Error('Only professors and admins can create grades');
        }
        
        return {
            ...data,
            createdById: user?.id
        };
    }
}

export default CreateGradeRequest;