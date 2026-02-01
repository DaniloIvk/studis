import type { FormFieldBaseContract, FormFieldUtils } from '../Form';

export type FileUploadContract = FormFieldBaseContract & {
	readonly type: 'fileUpload';
	readonly filenameField: string;
	readonly filepathField: string;
	readonly multiple?: boolean;
	readonly allowClear?: boolean;
};

export type FileUploadProps = FileUploadContract & FormFieldUtils;
