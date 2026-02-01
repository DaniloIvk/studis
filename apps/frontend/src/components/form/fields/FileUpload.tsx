import { useEffect, useState, type BaseSyntheticEvent } from 'react';
import { t } from 'i18next';
import type { FileUploadProps } from '../../../types/Common';
import Icons from '../../../common/Icons';
import Message from '../Message';
import Label from './Label';
import { concat } from '../../../common/helpers';

function FileUpload({
	name,
	label,
	placeholder,
	filenameField,
	filepathField,
	register,
	setValue,
	watch,
	errors,
	className = '',
	multiple = false,
	allowClear = true,
	disabled = false,
	readOnly = false,
}: FileUploadProps) {
	const existingName: string = watch(filenameField);
	const existingPath: string = watch(filepathField);
	const newFiles: FileList = watch(name);
	const modifiable: boolean = !(disabled || readOnly);
	const hasExistingFile: boolean = Boolean(existingPath);
	const hasUploadedFile: boolean = Boolean(newFiles && newFiles.length > 0);
	const [containsAnyFile, setContainsAnyFile] = useState<boolean>(
		hasExistingFile || hasUploadedFile,
	);
	const [previewUrl, setPreviewUrl] = useState<string>(existingPath || '#');
	const filename: string =
		containsAnyFile ?
			hasUploadedFile ?
				Array.from(newFiles)
					.map((file) => file.name)
					.join(', ')
			:	existingName
		:	'';
	placeholder ??= multiple ? 'form.upload_a_file' : 'form.upload_files';

	function handleClear(event: BaseSyntheticEvent): void {
		event.stopPropagation();
		event.preventDefault();
		setValue(name, null);
		setContainsAnyFile(false);
	}

	useEffect(() => {
		if (!hasUploadedFile) {
			return;
		}

		setContainsAnyFile(hasUploadedFile);

		const previewUrl = URL.createObjectURL(newFiles[0]);
		setPreviewUrl(previewUrl);

		return () => URL.revokeObjectURL(previewUrl);
	}, [hasUploadedFile, newFiles]);

	return (
		<Label
			text={label}
			className={className}
		>
			<div
				className={concat(
					'non-material bg-dark/5! dark:bg-light/15! relative group rounded-md',
					modifiable ?
						containsAnyFile ? 'cursor-auto'
						:	'cursor-pointer'
					: disabled || !containsAnyFile ? 'cursor-not-allowed'
					: 'cursor-auto',
				)}
			>
				<input
					type='file'
					autoComplete='off'
					autoCapitalize='off'
					className='peer w-full h-full text-ellipsis text-nowrap opacity-0 invisible'
					multiple={multiple}
					disabled={!modifiable || containsAnyFile}
					{...register(name)}
				/>

				<div
					className={concat(
						'absolute top-0 left-0 right-0 bottom-0 flex items-center gap-2 rounded select-none',
						containsAnyFile ? 'px-11' : 'pl-3 pr-11',
						disabled && 'text-neutral!',
					)}
				>
					{containsAnyFile ?
						<a
							href={disabled ? undefined : previewUrl}
							target='_blank'
							rel='noopener noreferrer'
							className={concat(
								'w-full leading-10 truncate',
								!disabled && 'hover:underline',
							)}
							download
						>
							{filename}
						</a>
					:	<span className='w-full leading-10 truncate'>{t(placeholder)}</span>}
				</div>

				{containsAnyFile ?
					<Icons.FilePresent
						className={concat(
							!modifiable && 'fill-neutral!',
							modifiable && 'fill-primary!',
							modifiable && 'group-hover:fill-primary-hover!',
							modifiable && 'group-active:fill-primary-hover!',
							'absolute top-1/2 left-3 -translate-y-1/2 w-6 h-6 transition-colors duration-300',
						)}
					/>
				:	<Icons.Upload
						className={concat(
							!modifiable && 'fill-neutral!',
							modifiable && 'fill-primary!',
							modifiable && 'group-hover:fill-primary-hover!',
							modifiable && 'group-active:fill-primary-hover!',
							'absolute top-1/2 right-2.5 -translate-y-1/2 w-6 h-6 transition-colors duration-300',
						)}
					/>
				}
				{allowClear && modifiable && containsAnyFile && (
					<Icons.Close
						onClick={handleClear}
						className='hover:fill-error! absolute top-1/2 right-2.5 -translate-y-1/2 w-6 h-6 cursor-pointer transition-colors duration-300'
					/>
				)}
			</div>

			{errors[name] && (
				<Message
					text={`${errors[name]?.message}`}
					variant='error'
				/>
			)}
		</Label>
	);
}

export default FileUpload;
