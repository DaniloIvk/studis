import { z } from 'zod'
import FormRequest from "../../../core/http/Request"
import { currentUser } from '../../../core/helpers/currentUser'

const CreateExamSchema = z.object({
    courseId: z.number().int().positive(),
    examPeriodId: z.number().int().positive(),
    title: z.string().min(1).max(255),
    description: z.string().optional().default(''),
    date: z.preprocess(
        (val) => (val instanceof Date ? val : new Date(val as string)),
        z.date()
    )
});

type CreateExamData = z.infer<typeof CreateExamSchema>;

class CreateExamRequest extends FormRequest {
    protected rules() {
        return CreateExamSchema.shape;
    }

    protected transformValidatedData(data: any): CreateExamData & { createdById: number | undefined } {
        const user = currentUser();
        
        return {
            ...data,
            createdById: user?.id
        };
    }
}

export default CreateExamRequest;