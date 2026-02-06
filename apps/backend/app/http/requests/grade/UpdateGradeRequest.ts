import { z } from 'zod'
import FormRequest from "../../../core/http/Request"

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
}

export default UpdateGradeRequest;