import ApiService from '../core/service/ApiService';
import type { Course } from '../schema/models';

class CourseService extends ApiService<Course> {
	protected static basePath: string = 'api/course-materials';
}

export default CourseService;
