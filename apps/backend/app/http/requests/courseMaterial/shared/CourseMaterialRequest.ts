import fs from 'node:fs';
import path from 'node:path';
import FormRequest, { ValidationRules } from '../../../../core/http/Request';
import Rule from '../../../../core/validation/Rule';

type CourseMaterialPayload = {
	courseId: number;
	title: string;
	description: string;
	file?: Express.Multer.File;
	filename: string;
	filepath: string;
};

class CourseMaterialRequest extends FormRequest<CourseMaterialPayload> {
	protected async rules(): Promise<ValidationRules> {
		const courseMaterial = await this.routeModel('courseMaterial');

		return {
			courseId: Rule.integer().exists('course'),
			title: Rule.string().between(3, 255),
			description: Rule.string().optional(),
			file: Rule.file()
				.requiredIf(!courseMaterial)
				.maxSize(1024 * 1024 * 2)
				.mimeTypes(['application/pdf', 'text/plain'])
				.optional(),
		};
	}

	protected prepareForValidation(
		data: CourseMaterialPayload,
	): CourseMaterialPayload {
		if (data.courseId) {
			data.courseId = Number(data.courseId);
		}
		if (data.file) {
		}

		return data;
	}

	protected transformValidatedData(
		data: CourseMaterialPayload,
	): CourseMaterialPayload {
		if (data?.file) {
			const file = data.file as Express.Multer.File;

			const storageDir = path.resolve('storage/app/materials');

			if (!fs.existsSync(storageDir)) {
				fs.mkdirSync(storageDir, { recursive: true });
			}

			const originalName = path.basename(file.originalname);
			const extension = path.extname(originalName);
			const fileName = crypto.randomUUID() + extension;
			const finalPath = path.join(storageDir, fileName);

			data.filename = originalName;
			fs.renameSync(file.path, finalPath);
			data.filepath = `storage/app/materials/${fileName}`;

			delete data.file;
		}

		return data;
	}
}

export default CourseMaterialRequest;
