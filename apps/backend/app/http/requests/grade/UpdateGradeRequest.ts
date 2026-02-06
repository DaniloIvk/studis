import { z } from 'zod'
import FormRequest from "../../../core/http/Request"
import { currentUser } from '../../../core/helpers/currentUser'

const UpdateGradeSchema = z.object({
    courseId: z.number().int().positive().optional(),
    title: z.string().min(1).max(255).optional(),
    description: z.string().optional(),
    date: z.preprocess(
        (val) => (val instanceof Date ? val : new Date(val as string)),
        z.date()
    ).optional()
});

class UpdateGradeRequest extends FormRequest {
    protected rules() {
        return UpdateGradeSchema.shape;
    }

    protected transformValidatedData(data: any): UpdateGradeRequest & { createdById: number | undefined } {
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

export default UpdateGradeRequest;