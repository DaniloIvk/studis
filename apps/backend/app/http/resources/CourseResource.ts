import { Course } from '../../../database/prisma/client';
import Resource from '../../core/http/Resource';
import UserResource from './UserResource';

class CourseResource extends Resource<Course> {
	public serialize(): object {
		return {
			id: this.resource.id,
			professorId: this.resource.professorId,
			index: this.resource.index,
			name: this.resource.name,
			espb: this.resource.espb,
			semester: this.resource.semester,
			description: this.resource.description,
			professor:
				'professor' in this.resource ?
					UserResource.make(this.resource.professor)
				:	undefined,
		};
	}
}

export default CourseResource;
