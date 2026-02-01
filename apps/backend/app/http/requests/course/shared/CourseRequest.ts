import FormRequest, { ValidationRules } from '../../../../core/http/Request';
import Rule from '../../../../core/validation/Rule';
import { Course } from '../../../../../database/prisma/client';
import Semester from '../../../../enums/Semester';

class CourseRequest extends FormRequest<Course> {
	protected async rules(): Promise<ValidationRules> {
		const course = await this.routeModel('course');

		return {
			index: Rule.string()
				.between(2, 16)
				.uniqueWithIgnore('course', 'index', course),
			name: Rule.string().between(3, 255),
			professorId: Rule.integer().exists('user', 'id').optional(),
			semester: Rule.enum(Semester),
			espb: Rule.number().min(2).max(12),
			description: Rule.string(),
		};
	}
}

export default CourseRequest;
