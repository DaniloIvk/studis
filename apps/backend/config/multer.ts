import type { Options } from 'multer';

/**
 * Global Multer configuration.
 *
 * @see https://www.npmjs.com/package/multer
 */
const multerConfig: Options = {
	dest: './storage/uploads',
	limits: { fileSize: 1024 * 50, files: 10 },
};

export default multerConfig;
