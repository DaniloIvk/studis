import ApiService from '../core/service/ApiService';
import type { Course } from '../schema/models';

class CourseService extends ApiService<Course> {
	protected static basePath: string = 'api/courses';

	public async getAllWithoutPagination(): Promise<Partial<Course>> {
		const response = await this.fetch(`${CourseService.basePath}/all`, 'GET');

		return response as Promise<Partial<Course>>;
	}
}

export default CourseService;
