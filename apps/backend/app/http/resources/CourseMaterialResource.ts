import appConfig from '../../../config/app';
import { CourseMaterial } from '../../../database/prisma/client';
import Resource from '../../core/http/Resource';

class CourseMaterialResource extends Resource<CourseMaterial> {
	public serialize(): object {
		return {
			id: this.resource.id,
			courseId: this.resource.courseId,
			title: this.resource.title,
			description: this.resource.description,
			filename: this.resource.filename,
			filepath:
				this.resource.filepath ?
					appConfig.url(this.resource.filepath)
				:	undefined,
		};
	}
}

export default CourseMaterialResource;
